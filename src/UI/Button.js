export const Button = (props) => {
  let cls =
    'bg-emerald-500 text-white rounded-md self-end hover:bg-emerald-600 disabled:cursor-not-allowed bold-none py-1 px-2 lg:py-3 lg:px-6 lg:font-bold';

  if (props.isDanger) {
    cls =
      'text-red-400 rounded-md border border-red-400 self-start mb-3 w-36 hover:bg-red-400 hover:text-white disabled:cursor-not-allowed py-1 px-2 lg:py-2.5 lg:px-4 lg:font-bold';
  }

  if (props.className) {
    cls = `${cls} ${props.className}`;
  }

  return (
    <button onClick={props.onClick} disabled={props.disabled} className={cls}>
      {props.children}
    </button>
  );
};
