import { FC } from 'react';

interface TimeBadgeProps {
  deadline: Date;
}

export const TimeBadge: FC<TimeBadgeProps> = ({ deadline }: TimeBadgeProps) => {
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  let text: string;
  let bgColor: string;
  let isPulsing = false;

  if (diffMs < 0) {
    // Overdue
    text = 'Overdue';
    bgColor = 'bg-red-900';
  } else if (diffHours < 24) {
    // Critical - less than 24 hours
    text = `${Math.ceil(diffHours)} Hours Left`;
    bgColor = 'bg-red-500';
    isPulsing = true;
  } else if (diffDays < 3) {
    // Warning - less than 3 days
    text = `${Math.ceil(diffDays)} Days Left`;
    bgColor = 'bg-orange-500';
  } else {
    // Safe - more than 3 days
    text = `${Math.ceil(diffDays)} Days Left`;
    bgColor = 'bg-emerald-500';
  }

  const pulseClass = isPulsing ? 'animate-pulse' : '';

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${bgColor} ${pulseClass}`}
    >
      {text}
    </span>
  );
};
