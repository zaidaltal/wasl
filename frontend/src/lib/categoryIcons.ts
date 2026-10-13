import {
  Briefcase,
  Calculator,
  Camera,
  MagnifyingGlass,
  ChartLineUp,
  Code,
  DeviceMobile,
  FilmSlate,
  Handshake,
  Megaphone,
  Microphone,
  PaintBrush,
  PenNib,
  Scales,
  Terminal,
  Translate,
  Wrench,
  type Icon,
} from '@/components/ui/icons';

// Category icons are matched from the English name; the DB `icon` column holds emoji.
const CATEGORY_ICON: Array<[string, Icon]> = [
  ['web', Code],
  ['software', Terminal],
  ['mobile', DeviceMobile],
  ['design', PaintBrush],
  ['graphic', PaintBrush],
  ['writing', PenNib],
  ['content', PenNib],
  ['translation', Translate],
  ['marketing', Megaphone],
  ['video', FilmSlate],
  ['photo', Camera],
  ['seo', MagnifyingGlass],
  ['voice', Microphone],
  ['audio', Microphone],
  ['data', ChartLineUp],
  ['account', Calculator],
  ['finance', Calculator],
  ['legal', Scales],
  ['consult', Handshake],
  ['engineering', Wrench],
];

export function iconFor(nameEn = ''): Icon {
  const lower = nameEn.toLowerCase();
  return CATEGORY_ICON.find(([key]) => lower.includes(key))?.[1] ?? Briefcase;
}
