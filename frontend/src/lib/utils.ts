import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string, locale: string = 'en'): string {
  return new Date(dateStr).toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatCurrency(amount: number, locale: string = 'en'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-JO' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const COUNTRIES = [
  { value: 'Jordan', label_en: 'Jordan', label_ar: 'الأردن' },
  { value: 'Saudi Arabia', label_en: 'Saudi Arabia', label_ar: 'المملكة العربية السعودية' },
  { value: 'UAE', label_en: 'UAE', label_ar: 'الإمارات العربية المتحدة' },
  { value: 'Egypt', label_en: 'Egypt', label_ar: 'مصر' },
  { value: 'Kuwait', label_en: 'Kuwait', label_ar: 'الكويت' },
  { value: 'Qatar', label_en: 'Qatar', label_ar: 'قطر' },
  { value: 'Bahrain', label_en: 'Bahrain', label_ar: 'البحرين' },
  { value: 'Oman', label_en: 'Oman', label_ar: 'عُمان' },
  { value: 'Lebanon', label_en: 'Lebanon', label_ar: 'لبنان' },
  { value: 'Palestine', label_en: 'Palestine', label_ar: 'فلسطين' },
  { value: 'Iraq', label_en: 'Iraq', label_ar: 'العراق' },
  { value: 'Syria', label_en: 'Syria', label_ar: 'سوريا' },
  { value: 'Morocco', label_en: 'Morocco', label_ar: 'المغرب' },
  { value: 'Tunisia', label_en: 'Tunisia', label_ar: 'تونس' },
  { value: 'Algeria', label_en: 'Algeria', label_ar: 'الجزائر' },
];
