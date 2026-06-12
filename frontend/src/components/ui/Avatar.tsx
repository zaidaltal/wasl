import Image from 'next/image';
import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizes = { sm: 32, md: 40, lg: 64, xl: 96 };
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-lg', xl: 'text-2xl' };
  const px = sizes[size];

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-ink dark:bg-night-border flex items-center justify-center flex-shrink-0',
        'ring-1 ring-line dark:ring-night-border',
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
        <span className="text-white font-semibold select-none">{getInitials(name)}</span>
      )}
    </div>
  );
}
