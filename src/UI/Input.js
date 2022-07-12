export const Input = ({
  id,
  type,
  name,
  placeholder,
  register,
  errorMessage,
  isLabled,
  className,
}) => {
  let error = null;
  let cls =
    'w-full border border-slate-300 py-3 px-6 rounded-md mb-1 focus:outline-none focus:border-sky-500';

  if (className) {
    cls = `${cls} ${className}`;
  }

  if (errorMessage) {
    error = Object.keys(errorMessage) ? errorMessage[name]?.message : null;
  }

  return (
    <>
      {isLabled ? (
        <>
          {' '}
          <div className="flex flex-col">
            <label htmlFor={id} className="self-start text-gray-400">
              {`${name.charAt(0).toUpperCase()}${name.slice(1)}`}
            </label>
            <input
              id={id}
              type={type}
              placeholder={placeholder}
              {...register}
              className={cls}
            />
            <p className="text-red-500 mb-4 text-sm self-start">{error}</p>
          </div>
        </>
      ) : (
        <>
          {' '}
          <div className="flex flex-col">
            <input
              id={id}
              type={type}
              placeholder={placeholder}
              {...register}
              className={cls}
            />
            <p className="text-red-500 mb-4 text-sm self-start">{error}</p>
          </div>
        </>
      )}
    </>
  );
};
