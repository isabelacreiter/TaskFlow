'use client';

import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button {...props} className={`px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 ${className}`}>
      {children}
    </button>
  );
}
