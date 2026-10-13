import { cn } from '@/lib/utils';
import { CircleNotch } from './icons';

export function Spinner({ className }: { className?: string }) {
  return <CircleNotch aria-hidden weight="bold" className={cn('animate-spin', className)} />;
}
