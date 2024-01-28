// import classNames from 'classnames';
// import { useSetState } from 'ahooks';

export function DualCols(props) {
  return (
    <div className="flex align-middle text-base min-h-[34px] py-1">
      <div className="basis-5/12 capitalize ">{props.children?.[0]}</div>
      <div className="flex-1 text-sm"> {props.children?.[1]}</div>
    </div>
  );
}
