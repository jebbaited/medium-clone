import React, { FC } from 'react';

interface Props {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const ButtonForCommentSection: FC<Props> = ({
  className,
  disabled,
  onClick,
  children,
}) => {
  let cls =
    'rounded-md self-end disabled:cursor-not-allowed bold-none lg:font-bold px-0 py-0 text-gray-400 text-xs hover:bg-white lg:px-0 lg:py-0 mr-2 dark:bg-black';
  if (className) cls = `${cls} ${className}`;

  return (
    <button onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
};
