import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Classes for the outer tray (shell) */
  shellClassName?: string;
  hover?: boolean;
}

/**
 * Double-bezel card: an outer tray with a hairline ring holding an inner plate.
 * `className` styles the inner plate, which is where content padding belongs.
 */
export function Card({ children, className, shellClassName, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'shell',
        hover && 'transition-[transform,box-shadow] duration-500 ease-fluid hover:-translate-y-1 hover:shadow-lift',
        shellClassName
      )}
    >
      <div className={cn('core h-full', className)}>{children}</div>
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 pt-6 pb-4', className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 pb-6', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-4 border-t border-line', className)}>{children}</div>;
}
