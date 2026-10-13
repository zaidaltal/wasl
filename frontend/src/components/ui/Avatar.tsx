import Image from 'next/image';
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = { sm: 32, md: 40, lg: 56, xl: 104 };
const textSizes = { sm: 'text-[11px]', md: 'text-sm', lg: 'text-base', xl: 'text-3xl' };

/** Squircle avatar. Falls back to initials on the accent tint. */
export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const px = sizes[size];

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-[32%]',
        'bg-accent-soft text-accent-strong ring-1 ring-inset ring-ink/[0.06]',
        textSizes[size],
        className
      )}
      style={{ width: px, height: px }}
    >
      {src ? (
        <Image
          src={src.startsWith('http') ? src : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/${src}`}
          alt={name}
          fill
          className="object-cover"
          sizes={`${px}px`}
        />
      ) : (
        <span className="select-none font-semibold tracking-wide">{getInitials(name)}</span>
      )}
    </div>
  );
}
