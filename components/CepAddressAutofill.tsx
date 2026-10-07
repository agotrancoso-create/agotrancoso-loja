'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type CepPayload = {
  found?: boolean;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  error?: string;
};

function setReactInputValue(input: HTMLInputElement | null, value: string) {
  if (!input) return;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function addressSummary(data: CepPayload) {
  const locality = [data.city, data.state].filter(Boolean).join('/');
  return [data.street, data.neighborhood, locality].filter(Boolean).join(' · ');
}

export default function CepAddressAutofill() {
  const pathname = usePathname();

  useEffect(() => {
    const english = pathname === '/en/checkout';
    if (pathname !== '/checkout' && !english) return;

    let cleanupInput: (() => void) | null = null;
    let attachedInput: HTMLInputElement | null = null;
    let debounce = 0;
    let request = 0;
    let activeRequest: AbortController | null = null;
    let focusTimer = 0;
    let observer: MutationObserver | null = null;

    const attach = () => {
      const zip = document.getElementById('zip') as HTMLInputElement | null;
      if (!zip || zip.dataset.agoCepEnhanced === 'true') return false;
      zip.dataset.agoCepEnhanced = 'true';
      attachedInput = zip;

      const field = zip.closest('.checkout-field');
      const status = document.createElement('span');
      status.className = 'ago-cep-status';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.setAttribute('data-no-translate', 'true');
      field?.appendChild(status);

      const lookup = async () => {
        const cep = zip.value.replace(/\D/g, '');
        if (cep.length !== 8) {
          status.textContent = '';
          status.classList.remove('is-success', 'is-error', 'is-loading');
          return;
        }

        const currentRequest = ++request;
        activeRequest?.abort();
        const controller = new AbortController();
        activeRequest = controller;
        status.textContent = english ? 'Looking up address…' : 'Buscando endereço…';
        status.classList.remove('is-success', 'is-error');
        status.classList.add('is-loading');
        zip.setAttribute('aria-busy', 'true');

        try {
          const response = await fetch(`/api/cep?cep=${encodeURIComponent(cep)}`, { cache: 'no-store', signal: controller.signal });
          const data = await response.json() as CepPayload;
          if (currentRequest !== request || zip.value.replace(/\D/g, '') !== cep) return;

          if (!response.ok || data.found === false) {
            throw new Error(english
              ? 'ZIP code not found. Check the code or enter the address manually.'
              : data.error || 'CEP não encontrado.');
          }

          setReactInputValue(document.getElementById('street') as HTMLInputElement | null, data.street || '');
          setReactInputValue(document.getElementById('neighborhood') as HTMLInputElement | null, data.neighborhood || '');
          setReactInputValue(document.getElementById('city') as HTMLInputElement | null, data.city || '');
          setReactInputValue(document.getElementById('state') as HTMLInputElement | null, data.state || '');

          const summary = addressSummary(data);
          if (data.street) {
            status.textContent = english
              ? `Address found: ${summary}. Enter the building number${data.neighborhood ? '' : ' and check the neighborhood'}.`
              : `Endereço encontrado: ${summary}. Agora informe apenas o número${data.neighborhood ? '' : ' e confira o bairro'}.`;
          } else {
            status.textContent = english
              ? `ZIP code found${summary ? `: ${summary}` : ''}. No street is available for this ZIP code; enter the street and building number.`
              : `CEP localizado${summary ? `: ${summary}` : ''}. Este CEP não informa a rua; preencha rua e número.`;
          }
          status.classList.remove('is-loading', 'is-error');
          status.classList.add('is-success');

          focusTimer = window.setTimeout(() => {
            if (currentRequest !== request || zip.value.replace(/\D/g, '') !== cep) return;
            const targetId = data.street ? 'number' : 'street';
            (document.getElementById(targetId) as HTMLInputElement | null)?.focus();
          }, 120);
        } catch (error) {
          if (currentRequest !== request || controller.signal.aborted || zip.value.replace(/\D/g, '') !== cep) return;
          status.textContent = english
            ? 'Unable to find the address. Check the ZIP code or enter the address manually.'
            : error instanceof Error ? error.message : 'Não foi possível consultar o CEP agora.';
          status.classList.remove('is-loading', 'is-success');
          status.classList.add('is-error');
        } finally {
          if (currentRequest === request) zip.removeAttribute('aria-busy');
        }
      };

      const onInput = () => {
        window.clearTimeout(debounce);
        window.clearTimeout(focusTimer);
        request += 1;
        activeRequest?.abort();
        zip.removeAttribute('aria-busy');
        const cep = zip.value.replace(/\D/g, '');
        if (cep.length < 8) {
          request += 1;
          status.textContent = '';
          status.classList.remove('is-loading', 'is-success', 'is-error');
          return;
        }
        debounce = window.setTimeout(lookup, 220);
      };

      zip.addEventListener('input', onInput);
      if (zip.value.replace(/\D/g, '').length === 8) onInput();

      cleanupInput = () => {
        window.clearTimeout(debounce);
        window.clearTimeout(focusTimer);
        request += 1;
        activeRequest?.abort();
        zip.removeAttribute('aria-busy');
        zip.removeEventListener('input', onInput);
        zip.removeAttribute('data-ago-cep-enhanced');
        status.remove();
        attachedInput = null;
      };
      return true;
    };

    // Checkout replaces the address fields when moving between steps. Rebind
    // the new input and cancel requests associated with the removed fields.
    observer = new MutationObserver(() => {
      if (attachedInput && !attachedInput.isConnected) {
        cleanupInput?.();
        cleanupInput = null;
      }
      if (!attachedInput) attach();
    });
    observer.observe(document.getElementById('conteudo-principal') || document.body, { childList: true, subtree: true });
    attach();

    return () => {
      observer?.disconnect();
      cleanupInput?.();
      window.clearTimeout(debounce);
    };
  }, [pathname]);

  return null;
}
