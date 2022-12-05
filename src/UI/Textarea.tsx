import React, { FC } from 'react';

interface Props {
  id: string;
  name: string;
  rows: string;
  placeholder: string;
  register: any;
  isLabeled?: boolean;
  errorMessage?: any;
}

export const Textarea: FC<Props> = (props) => {
  let error = null;
  if (props.errorMessage) {
    error = Object.keys(props.errorMessage)
      ? props.errorMessage[props.name]?.message
      : null;
  }

  return (
    <>
      {props.isLabeled && (
        <label htmlFor={props.id} className="text-left text-gray-400">
          {`${props.name.charAt(0).toUpperCase()}${props.name.slice(1)}`}
        </label>
      )}
      <div className="flex justify-center w-full">
        <div className="w-full">
          <textarea
            className="
        form-control
        block
        w-full
        px-2
        py-1
        resize-none
        font-normal
        bg-white bg-clip-padding
        border border-solid border-slate-300
        rounded-md
        transition
        ease-in-out
        mb-1
        focus:border-sky-500 focus:outline-none
        text-sm lg:text-base
        lg:px-6 lg:py-3
      "
            id={props.id}
            rows={props.rows}
            name={props.name}
            placeholder={props.placeholder}
            {...props.register}
          ></textarea>
          <p className="text-red-500 mb-4 text-sm self-start">{error}</p>
        </div>
      </div>
    </>
  );
};
