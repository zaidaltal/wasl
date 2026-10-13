'use client';

import { useCallback, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from './Modal';
import { Button } from './Button';

/**
 * Styled replacement for window.confirm().
 *   const [confirm, confirmDialog] = useConfirm();
 *   if (!(await confirm(message))) return;
 * Render {confirmDialog} once in the component.
 */
export function useConfirm() {
  const t = useTranslations('confirm');
  const [message, setMessage] = useState<string | null>(null);
  const resolver = useRef<(ok: boolean) => void>();

  const confirm = useCallback((msg: string) => {
    setMessage(msg);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = useCallback((ok: boolean) => {
    resolver.current?.(ok);
    resolver.current = undefined;
    setMessage(null);
  }, []);

  const dialog = (
    <Modal open={message !== null} onClose={() => close(false)} title={t('title')} size="sm">
      <p className="text-[15px] leading-relaxed text-ink-soft">{message}</p>
      <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={() => close(false)}>
          {t('cancel')}
        </Button>
        <Button variant="danger" onClick={() => close(true)} className="bg-danger text-white ring-0 hover:bg-danger/90">
          {t('delete')}
        </Button>
      </div>
    </Modal>
  );

  return [confirm, dialog] as const;
}
