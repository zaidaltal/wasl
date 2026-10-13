// Illustrative freelancer-and-job pairs for the landing hero. These are examples, not live
// listings, so the hero works without the API (and is labelled as examples for screen readers).

type L = { en: string; ar: string };

export interface HeroMatch {
  freelancer: { name: L; city: L; country: L; skills: string[]; rate: number };
  job: { company: L; country: L; title: L; budget: number; category: L };
}

export const HERO_MATCHES: HeroMatch[] = [
  {
    freelancer: {
      name: { en: 'Rana Khalil', ar: 'رنا خليل' },
      city: { en: 'Amman', ar: 'عمّان' },
      country: { en: 'Jordan', ar: 'الأردن' },
      skills: ['React', 'Next.js', 'Arabic RTL'],
      rate: 40,
    },
    job: {
      company: { en: 'Dar Al Azyaa', ar: 'دار الأزياء' },
      country: { en: 'Saudi Arabia', ar: 'السعودية' },
      title: { en: 'Bilingual online store for a Riyadh fashion label', ar: 'متجر إلكتروني ثنائي اللغة لعلامة أزياء في الرياض' },
      budget: 3200,
      category: { en: 'Web Development', ar: 'تطوير الويب' },
    },
  },
  {
    freelancer: {
      name: { en: 'Omar Haddad', ar: 'عمر حداد' },
      city: { en: 'Beirut', ar: 'بيروت' },
      country: { en: 'Lebanon', ar: 'لبنان' },
      skills: ['Brand identity', 'Arabic typography', 'Packaging'],
      rate: 35,
    },
    job: {
      company: { en: 'Zaytoun Ajloun', ar: 'زيتون عجلون' },
      country: { en: 'Jordan', ar: 'الأردن' },
      title: { en: 'Logo and bottle labels for a family olive oil brand', ar: 'شعار وملصقات عبوات لعلامة زيت زيتون عائلية' },
      budget: 1150,
      category: { en: 'Graphic Design', ar: 'التصميم الجرافيكي' },
    },
  },
  {
    freelancer: {
      name: { en: 'Layla Mansour', ar: 'ليلى منصور' },
      city: { en: 'Cairo', ar: 'القاهرة' },
      country: { en: 'Egypt', ar: 'مصر' },
      skills: ['Arabic copywriting', 'SEO writing', 'Proofreading'],
      rate: 25,
    },
    job: {
      company: { en: 'Souq Bloom', ar: 'سوق بلوم' },
      country: { en: 'UAE', ar: 'الإمارات' },
      title: { en: 'Arabic product descriptions for 180 beauty items', ar: 'أوصاف منتجات بالعربية لـ 180 منتج تجميل' },
      budget: 870,
      category: { en: 'Content Writing', ar: 'كتابة المحتوى' },
    },
  },
  {
    freelancer: {
      name: { en: 'Yousef Al-Amri', ar: 'يوسف العامري' },
      city: { en: 'Muscat', ar: 'مسقط' },
      country: { en: 'Oman', ar: 'عُمان' },
      skills: ['Flutter', 'Firebase', 'Maps & GPS'],
      rate: 45,
    },
    job: {
      company: { en: 'Qahwa Corner', ar: 'ركن القهوة' },
      country: { en: 'Qatar', ar: 'قطر' },
      title: { en: 'Order-ahead app for a café chain in Doha', ar: 'تطبيق طلب مسبق لسلسلة مقاهٍ في الدوحة' },
      budget: 4600,
      category: { en: 'Mobile Development', ar: 'تطوير تطبيقات الجوال' },
    },
  },
  {
    freelancer: {
      name: { en: 'Noor Saleh', ar: 'نور صالح' },
      city: { en: 'Kuwait City', ar: 'مدينة الكويت' },
      country: { en: 'Kuwait', ar: 'الكويت' },
      skills: ['Arabic voiceover', 'Gulf dialect', 'Audio editing'],
      rate: 30,
    },
    job: {
      company: { en: 'Masar Fintech', ar: 'مسار للتقنية المالية' },
      country: { en: 'Bahrain', ar: 'البحرين' },
      title: { en: 'Voiceover for a three-minute app explainer video', ar: 'تعليق صوتي لفيديو تعريفي بتطبيق مدته ثلاث دقائق' },
      budget: 420,
      category: { en: 'Voiceover', ar: 'التعليق الصوتي' },
    },
  },
];
