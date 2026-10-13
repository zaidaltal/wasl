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

// Supported countries, Jordan first. `value` is what the API stores; `code` is ISO 3166-1 alpha-2 (used for flags).
export const COUNTRIES = [
  { value: 'Jordan', code: 'JO', label_en: 'Jordan', label_ar: 'الأردن' },
  { value: 'Saudi Arabia', code: 'SA', label_en: 'Saudi Arabia', label_ar: 'المملكة العربية السعودية' },
  { value: 'UAE', code: 'AE', label_en: 'UAE', label_ar: 'الإمارات العربية المتحدة' },
  { value: 'Egypt', code: 'EG', label_en: 'Egypt', label_ar: 'مصر' },
  { value: 'Kuwait', code: 'KW', label_en: 'Kuwait', label_ar: 'الكويت' },
  { value: 'Qatar', code: 'QA', label_en: 'Qatar', label_ar: 'قطر' },
  { value: 'Bahrain', code: 'BH', label_en: 'Bahrain', label_ar: 'البحرين' },
  { value: 'Oman', code: 'OM', label_en: 'Oman', label_ar: 'عُمان' },
  { value: 'Lebanon', code: 'LB', label_en: 'Lebanon', label_ar: 'لبنان' },
  { value: 'Palestine', code: 'PS', label_en: 'Palestine', label_ar: 'فلسطين' },
  { value: 'Iraq', code: 'IQ', label_en: 'Iraq', label_ar: 'العراق' },
  { value: 'Syria', code: 'SY', label_en: 'Syria', label_ar: 'سوريا' },
  { value: 'Morocco', code: 'MA', label_en: 'Morocco', label_ar: 'المغرب' },
  { value: 'Tunisia', code: 'TN', label_en: 'Tunisia', label_ar: 'تونس' },
  { value: 'Algeria', code: 'DZ', label_en: 'Algeria', label_ar: 'الجزائر' },
];
