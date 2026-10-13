'use client';

import { forwardRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Eye, EyeSlash, LockSimple } from '@/components/ui/icons';

type Props = React.ComponentProps<typeof Input>;

/** Password field with a show/hide toggle and a Caps Lock warning. */
export const PasswordInput = forwardRef<HTMLInputElement, Props>(({ onKeyUp, onKeyDown, onBlur, helperText, ...props }, ref) => {
  const t = useTranslations('auth');
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const checkCaps = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // getModifierState is unreliable on some mobile keyboards; only trust it when it reports a value
    if (typeof e.getModifierState === 'function') setCapsLock(e.getModifierState('CapsLock'));
  };

  return (
    <Input
      ref={ref}
      type={visible ? 'text' : 'password'}
      icon={<LockSimple size={17} />}
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      helperText={capsLock ? t('capsLock') : helperText}
      onKeyUp={(e) => {
        checkCaps(e);
        onKeyUp?.(e);
      }}
      onKeyDown={(e) => {
        checkCaps(e);
        onKeyDown?.(e);
      }}
      onBlur={(e) => {
        setCapsLock(false);
        onBlur?.(e);
      }}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? t('hidePassword') : t('showPassword')}
          aria-pressed={visible}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-ink"
        >
          {visible ? <EyeSlash size={17} aria-hidden /> : <Eye size={17} aria-hidden />}
        </button>
      }
      {...props}
    />
  );
});
PasswordInput.displayName = 'PasswordInput';
