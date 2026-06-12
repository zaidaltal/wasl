import { cn } from '@/lib/utils';

const variants = {
  success: 'bg-success-50 text-success-700 dark:bg-success-900/40 dark:text-success-200',
  warning: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  error: 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
  neutral: 'bg-gray-100 text-gray-600 dark:bg-night-card dark:text-gray-300',
  // aliases kept for existing call sites
  default: 'bg-gray-100 text-gray-600 dark:bg-night-card dark:text-gray-300',
  danger: 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
  info: 'bg-gray-100 text-gray-600 dark:bg-night-card dark:text-gray-300',
  primary: 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
