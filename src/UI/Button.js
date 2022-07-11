export const Button = (props) => {
  let cls =
    'bg-emerald-500 py-3 px-6 text-white rounded-md font-bold self-end hover:bg-emerald-600 disabled:cursor-not-allowed';
  if (props.isDanger) {
    cls =
      'text-red-400 py-2 px-4 rounded border border-red-400 self-start mb-3 w-36 font-bold hover:bg-red-400 hover:text-white disabled:cursor-not-allowed';
  }
  return (
    <button onClick={props.onClick} disabled={props.disabled} className={cls}>
      {props.children}
    </button>
  );
};
