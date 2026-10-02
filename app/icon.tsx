import { ImageResponse } from 'next/og';

export const size = { width: 96, height: 96 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#faf3e8',
        }}
      >
        <img
          src="https://www.agotrancoso.com.br/produtos/igreja-quadrado-m.jpg"
          width="96"
          height="96"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    ),
    size
  );
}
