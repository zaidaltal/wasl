import { Avatar } from '@/components/ui/Avatar';

interface DashboardHeaderProps {
  name: string;
  avatar?: string | null;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

export function DashboardHeader({ name, avatar, title, subtitle, actions }: DashboardHeaderProps) {
  return (
    <div className="flex animate-fade-up flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Avatar src={avatar} name={name} size="lg" />
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

interface StatTileProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  emphasis?: boolean;
  delay?: number;
}

/** Metric tile. The emphasised tile inverts to ink so the grid has one clear anchor. */
export function StatTile({ label, value, icon, emphasis = false, delay = 0 }: StatTileProps) {
  return (
    <div className="shell animate-fade-up" style={{ animationDelay: `${delay * 60}ms` }}>
      <div className={emphasis ? 'flex h-full flex-col rounded-core bg-ink p-6 text-canvas' : 'core flex h-full flex-col p-6'}>
        <div className="flex items-center justify-between">
          <span className={emphasis ? 'text-[13px] font-medium text-canvas/70' : 'text-[13px] font-medium text-muted'}>{label}</span>
          <span
            className={
              emphasis
                ? 'flex h-9 w-9 items-center justify-center rounded-xl bg-canvas/10'
                : 'flex h-9 w-9 items-center justify-center rounded-xl bg-sunken text-ink-soft'
            }
          >
            {icon}
          </span>
        </div>
        <p className="num display mt-8 text-5xl">{value}</p>
      </div>
    </div>
  );
}
