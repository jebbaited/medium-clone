export const Textarea = (props) => {
  let error = null;
  if (props.errorMessage) {
    error = Object.keys(props.errorMessage)
      ? props.errorMessage[props.name]?.message
      : null;
  }

  return (
    <>
      {props.isLabled ? (
        <label htmlFor={props.id} className="text-left text-gray-400">
          {`${props.name.charAt(0).toUpperCase()}${props.name.slice(1)}`}
        </label>
      ) : null}
      <div className="flex justify-center">
        <div className="w-full">
          <textarea
            className="
        form-control
        block
        w-full
        px-6
        py-3
        resize-none
        text-base
        font-normal
        bg-white bg-clip-padding
        border border-solid border-slate-300
        rounded-md
        transition
        ease-in-out
        mb-1
        focus:border-sky-500 focus:outline-none
      "
            id={props.id}
            rows={props.rows}
            name={props.name}
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => props.onChange(e)}
            {...props.register}
          ></textarea>
          <p className="text-red-500 mb-4 text-sm self-start">{error}</p>
        </div>
      </div>
    </>
  );
};
