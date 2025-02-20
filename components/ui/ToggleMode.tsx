'use client';

import * as React from 'react';
import { SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from 'lib/utils';

const ToggleMode = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className={cn('flex h-12 w-12 items-center justify-center', className)}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <SunMoon strokeWidth={1.5} className='h-[1.75rem] w-[1.75rem]' />
      <span className='sr-only'>Toggle theme</span>
    </button>
  );
};

export default ToggleMode;
