import React, { FC } from 'react';

interface Props {
  id: string;
  type?: string;
  name: string;
  placeholder?: string;
  register?: any;
  errorMessage?: any;
  isLabeled?: boolean;
  className?: string;
}

export const Input: FC<Props> = ({
  id,
  type,
  name,
  placeholder,
  register,
  errorMessage,
  isLabeled,
  className,
}) => {
  let error = null;
  let cls: string =
    'w-full border border-slate-300 py-3 px-6 rounded-md mb-1 focus:outline-none focus:border-sky-500 bg-white';

  if (className) {
    cls = `${cls} ${className}`;
  }

  if (errorMessage) {
    error = Object.keys(errorMessage) ? errorMessage[name]?.message : null;
  }

  return (
    <>
      {isLabeled ? (
        <>
          <label
            htmlFor={id}
            className="text-left text-gray-400"
            data-testid="label-for-input"
          >
            {`${name.charAt(0).toUpperCase()}${name.slice(1)}`}
          </label>
        </>
      ) : null}
      <div>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          {...register}
          className={cls}
          data-testid="input-for-components"
        />
        <p className="text-red-500 mb-4 text-sm self-start">{error}</p>
      </div>
    </>
  );
};
