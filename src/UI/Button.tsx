import React, { FC } from 'react';

interface Props {
  disabled?: boolean;
  isDanger?: boolean;
  onClick?: () => void;
  className?: string;
  dataTestId?: string;
  children: React.ReactNode;
}

export const Button: FC<Props> = ({
  disabled,
  isDanger,
  onClick,
  className,
  children,
  dataTestId,
}) => {
  let cls =
    'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-700 dark:hover:bg-emerald-900 text-white rounded-md self-end disabled:cursor-not-allowed bold-none py-1 px-2 lg:py-3 lg:px-6 lg:font-bold';

  if (isDanger)
    cls =
      'text-red-400 rounded-md border border-red-400 self-start mb-3 w-36 hover:bg-red-400 hover:text-white disabled:cursor-not-allowed py-1 px-2 lg:py-2.5 lg:px-4 lg:font-bold dark:hover:bg-red-800';

  if (className) cls = `${cls} ${className} `;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cls}
      data-testid={dataTestId}
    >
      {children}
    </button>
  );
};
