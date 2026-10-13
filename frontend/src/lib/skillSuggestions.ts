// Starter skills suggested during freelancer onboarding, matched from the category's English name.
// Freelancers can always add their own on top of these.
const SUGGESTIONS: Array<[RegExp, string[]]> = [
  [/web/i, ['React', 'Next.js', 'Node.js', 'PHP', 'Laravel', 'WordPress', 'TypeScript', 'HTML & CSS', 'MySQL', 'Tailwind CSS']],
  [/mobile/i, ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Firebase', 'iOS', 'Android', 'App Store publishing']],
  [/ui|ux/i, ['Figma', 'UI design', 'UX research', 'Wireframing', 'Prototyping', 'Design systems', 'Arabic RTL layouts']],
  [/graphic|design/i, ['Logo design', 'Branding', 'Adobe Illustrator', 'Photoshop', 'Arabic typography', 'Social media graphics', 'Print design', 'Figma']],
  [/writing|content/i, ['Arabic copywriting', 'English copywriting', 'SEO writing', 'Blog posts', 'Technical writing', 'Proofreading', 'Scriptwriting']],
  [/translat/i, ['Arabic to English', 'English to Arabic', 'French to Arabic', 'Legal translation', 'Localization', 'Subtitling', 'Proofreading']],
  [/seo/i, ['Technical SEO', 'Keyword research', 'On-page SEO', 'Link building', 'Google Search Console', 'Arabic SEO']],
  [/marketing/i, ['Social media marketing', 'Meta Ads', 'Google Ads', 'Content strategy', 'Email marketing', 'TikTok marketing', 'Analytics']],
  [/video/i, ['Video editing', 'Premiere Pro', 'After Effects', 'Motion graphics', 'Color grading', 'Reels & short video']],
  [/photo/i, ['Product photography', 'Event photography', 'Photo editing', 'Lightroom', 'Portrait photography']],
  [/voice|audio/i, ['Arabic voiceover', 'English voiceover', 'Podcast editing', 'Audio mixing', 'Dubbing']],
  [/data/i, ['Excel', 'SQL', 'Python', 'Power BI', 'Tableau', 'Data cleaning', 'Dashboards']],
  [/account|financ/i, ['Bookkeeping', 'QuickBooks', 'Financial modeling', 'Tax preparation', 'IFRS', 'Payroll']],
  [/consult/i, ['Business plans', 'Market research', 'Strategy', 'Project management', 'Pitch decks']],
  [/software|engineer/i, ['Python', 'Java', 'APIs', 'AWS', 'DevOps', 'QA testing', 'System design']],
];

const FALLBACK = ['Communication', 'Project management', 'Research', 'Microsoft Office', 'Customer support'];

export function suggestSkills(categoryNameEn?: string | null): string[] {
  if (!categoryNameEn) return FALLBACK;
  return SUGGESTIONS.find(([re]) => re.test(categoryNameEn))?.[1] ?? FALLBACK;
}
