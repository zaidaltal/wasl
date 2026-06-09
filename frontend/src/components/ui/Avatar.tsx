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
  const sizes = { sm: 32, md: 40, lg: 56, xl: 80 };
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base', xl: 'text-xl' };
  const px = sizes[size];

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-primary-600 flex items-center justify-center flex-shrink-0',
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
