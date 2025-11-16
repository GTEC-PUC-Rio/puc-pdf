import { HTMLAttributes } from 'react';

import { colors, radii } from '../tokens.ts';
import { cn } from '../../utils/cn.ts';

export const Badge = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span
    {...props}
    className={cn('inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wide', className)}
    style={{
      backgroundColor: `${colors.surfaceAlt}ee`,
      color: colors.accent,
      borderRadius: radii.sm,
      border: `1px solid ${colors.mutedBorder}`,
    }}
  />
);
