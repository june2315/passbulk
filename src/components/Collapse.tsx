// import { useEffect, useState } from 'react';
import { arrowDownIcon } from './Icons';
import { useSetState } from 'ahooks';

export default function Collapse(props: any) {
  const [state, setState] = useSetState({
    open: !!props.defaultOpen,
  });

  const handleToggleOpen = () => {
    setState({ open: !state.open });
  };

  return (
    <div className="pb-collapse">
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={handleToggleOpen}
      >
        <strong className="capitalize">{props.title}</strong>
        <i
          className="text-lg cursor-pointer transition-transform rotate-180 data-[open=true]:rotate-0"
          data-open={state.open}
        >
          {arrowDownIcon}
        </i>
      </div>
      <div
        className="dark:bg-neutral-800 h-0 p-4 py-0 transition-all overflow-hidden data-[open=true]:h-[revert] data-[open=true]:py-3"
        data-open={state.open}
      >
        {props.children}
      </div>
    </div>
  );
}
