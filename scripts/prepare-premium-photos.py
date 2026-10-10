#!/usr/bin/env python3
"""Generate non-destructive premium catalog backgrounds from original photographs.

Never overwrites a source image. Every product pixel firmly identified by the
mask is copied unchanged (RGB exact) to the lossless output.
"""
from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUTPUT = PUBLIC / "produtos" / "premium"
PRODUCTS = json.loads((ROOT / "data" / "products.json").read_text(encoding="utf-8"))["products"]
TARGET = np.array([252, 252, 250], dtype=np.float32)
EXPECTED = 38
MANUAL_REVIEW = ("colar", "terco", "rosario", "mobile", "ima-", "pretos-velhos",
                 "miniatura", "presepio", "cruzeiro")


def gallery_sources() -> list[str]:
    code = (ROOT / "lib" / "products.ts").read_text(encoding="utf-8")
    section = code.split("const RECOVERED_PRODUCT_GALLERIES", 1)[1].split("};", 1)[0]
    overrides = {}
    for product_id, gallery in re.findall(
        r"'([^']+)'\s*:\s*\[([^\]]+)\]", section, re.DOTALL
    ):
        overrides[product_id] = re.findall(r"['\"](/produtos/[^'\"]+)['\"]", gallery)
    active = sorted({src for product in PRODUCTS
                     for src in overrides.get(product["id"], product["images"])})
    print(f"Active photos: {len(active)}; source overrides: {len(overrides)}")
    if len(active) != EXPECTED:
        raise ValueError(f"Expected {EXPECTED} active photos, found {len(active)}. "
                         "Stop rather than silently omit any photo.")
    for src in active:
        if not src.startswith("/produtos/") or not (PUBLIC / src.lstrip("/")).is_file():
            raise ValueError(f"Missing catalog image: {src}")
    return active


def create_output(src: str, session) -> tuple[str, dict]:
    original = Image.open(PUBLIC / src.lstrip("/")).convert("RGB")
    rgb = np.asarray(original).copy()
    height, width = rgb.shape[:2]

    # Model supplies *only* an alpha mask; never regenerate product RGB.
    mask = np.asarray(remove(original, session=session, only_mask=True).convert("L"))
    foreground = np.uint8(mask >= 140)
    foreground = cv2.morphologyEx(foreground, cv2.MORPH_CLOSE,
                                  np.ones((3, 3), dtype=np.uint8))
    foreground = cv2.dilate(foreground, np.ones((3, 3), dtype=np.uint8),
                            iterations=1)
    count = int(foreground.sum())
    if count < 0.012 * width * height or count > 0.80 * width * height:
        raise ValueError(f"Untrustworthy segmentation coverage: {src} ({count / (width * height):.1%})")
    n, labels, stats, _ = cv2.connectedComponentsWithStats(foreground, connectivity=8)
    components = sorted((int(stats[i, cv2.CC_STAT_AREA]) for i in range(1, n)),
                        reverse=True)
    if not components or components[0] < count * 0.35:
        raise ValueError(f"Untrustworthy fragmented foreground: {src}")

    # Preserve fine cords/crosses with a small protective dilation.
    protected = cv2.GaussianBlur(foreground.astype(np.float32), (0, 0), sigmaX=0.7)
    protected = np.clip(protected, 0, 1)
    solid = protected >= 0.999
    if not solid.any():
        raise ValueError(f"No protected pixels: {src}")

    # Estimate the original backdrop from corner samples, then preserve the
    # original soft-shadow luminance variations close to the piece.
    patch_h = max(8, round(height * 0.05))
    patch_w = max(8, round(width * 0.05))
    corners = [
        rgb[:patch_h, :patch_w], rgb[:patch_h, -patch_w:],
        rgb[-patch_h:, :patch_w], rgb[-patch_h:, -patch_w:]
    ]
    c = [np.median(region.reshape(-1, 3), axis=0).astype(np.float32)
         for region in corners]
    y = np.linspace(0, 1, height, dtype=np.float32)[:, None, None]
    x = np.linspace(0, 1, width, dtype=np.float32)[None, :, None]
    baseline = ((1 - x) * (1 - y) * c[0] +
                x * (1 - y) * c[1] + (1 - x) * y * c[2] + x * y * c[3])

    # Distance from the protected product; distant backdrop is uniform.
    near = cv2.distanceTransform((foreground == 0).astype(np.uint8),
                                 cv2.DIST_L2, 3)
    proximity = np.exp(-near[..., None] / 55.0)
    shadow = np.clip(rgb.astype(np.float32) - baseline, -40, 0) * 0.85 * proximity
    backdrop = np.clip(TARGET + shadow, 0, 255)
    mixed = rgb.astype(np.float32) * protected[..., None] + \
            backdrop * (1 - protected[..., None])
    output = np.uint8(np.clip(np.rint(mixed), 0, 255))
    output[solid] = rgb[solid]

    # Square framing is implemented only by lossless cropping/padding.
    # No geometric transformations or resampling ever touch the ceramics.
    side = max(height, width)
    if height == width and height > 960:
        ys, xs = np.where(foreground > 0)
        required = max(xs.max() - xs.min() + 1,
                       ys.max() - ys.min() + 1)
        if required * 1.13 <= 960:
            side = 960
    dest = np.zeros((side, side, 3), dtype=np.uint8)
    dest[:] = TARGET.astype(np.uint8)
    if side >= max(height, width):
        xo, yo = (side - width) // 2, (side - height) // 2
        dest[yo:yo+height, xo:xo+width] = output
        protected_src = dest[yo:yo+height, xo:xo+width]
        assert np.array_equal(protected_src[solid], rgb[solid])
    else:
        ys, xs = np.where(foreground > 0)
        cx = round((xs.min() + xs.max()) / 2)
        cy = round((ys.min() + ys.max()) / 2)
        xo = max(0, min(width - side, cx - side // 2))
        yo = max(0, min(height - side, cy - side // 2))
        dest[:] = output[yo:yo+side, xo:xo+side]
        assert np.array_equal(dest[solid[yo:yo+side, xo:xo+side]],
                              rgb[yo:yo+side, xo:xo+side][solid[yo:yo+side, xo:xo+side]])
        if np.any(foreground[:yo]) or np.any(foreground[yo+side:]) or \
           np.any(foreground[:, :xo]) or np.any(foreground[:, xo+side:]):
            raise ValueError(f"Square crop would truncate product: {src}")

    OUTPUT.mkdir(parents=True, exist_ok=True)
    digest = hashlib.sha256(src.encode()).hexdigest()[:8]
    name = Path(src).stem + f"-premium-{digest}.webp"
    destination = OUTPUT / name
    Image.fromarray(dest, "RGB").save(destination, "WEBP",
                                     lossless=True, method=4, exact=True)
    decoded = np.asarray(Image.open(destination).convert("RGB"))
    if not np.array_equal(decoded, dest):
        raise ValueError(f"Lossless pixel verification failed: {src}")
    edge = np.vstack((decoded[0], decoded[-1], decoded[:, 0], decoded[:, -1]))
    report = {
        "source": src, "premium": f"/produtos/premium/{name}",
        "source_dimensions": [width, height], "result_dimensions": [side, side],
        "protected_pixels": int(solid.sum()),
        "verified_lossless": True,
        "border_warm_fraction": round(float(
            np.all(np.abs(edge.astype(np.int16) - TARGET) <= 5, axis=1).mean()), 3),
        "manual_visual_review": any(term in src for term in MANUAL_REVIEW)
    }
    return report["premium"], report


def main() -> None:
    active = gallery_sources()
    model = new_session("isnet-general-use")
    mapping = {}
    reports = []
    for index, src in enumerate(active, 1):
        premium, report = create_output(src, model)
        mapping[src] = premium
        reports.append(report)
        print(f"[{index:02d}/{len(active):02d}] {src} -> {premium} "
              f"({report['protected_pixels']} protected pixels)")
    (ROOT / "data" / "premium-photo-map.json").write_text(
        json.dumps(mapping, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (ROOT / "data" / "premium-photo-report.json").write_text(
        json.dumps(reports, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Complete: {len(mapping)} lossless square originals-preserved images.")


if __name__ == "__main__":
    main()
