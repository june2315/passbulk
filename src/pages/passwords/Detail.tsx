import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { closeIcon, diagonalKeyIcon, linkIcon } from '@/components/Icons';
import Collapse from '@/components/Collapse';
import { DualCols } from '@/components/Columns';
import TextPassword from '@/components/TextPassword';
import triggerCopyPassword from '@/common/copyPassword';
import useStore from '@/store';

export default function PasswordDetail(props) {
  const { open, data, onClose } = props;
  const ref: RefObject<any> = useRef();

  const globalPasswordMap = useStore((state) => state.passwordMap);
  const updatePasswordMap = useStore((state) => state.updatePasswordMap);

  useEffect(() => {
    // console.log(ref.current?.getBoundingClientRect?.());
    console.log('data', data);
  }, [open]);

  return (
    <div
      ref={ref}
      className={classNames(
        { visible: open, hidden: !open },
        'absolute top-0 right-0 bottom-0 w-[330px]  dark:bg-[#353535] shadow-[-5px_0_9px_0_rgba(0,0,0,0.5)]'
      )}
    >
      {/* title */}
      <div className="flex items-start flex-nowrap border-b border-neutral-900 p-3 overflow-hidden">
        <div className="mr-4 bg-neutral-950 rounded-full w-12 h-12 flex items-center justify-center text-xl text-gray-400 flex-shrink-0">
          {diagonalKeyIcon}
        </div>
        <div className="flex-1 text-ellipsis overflow-hidden">
          <div className="flex items-center">
            <strong className="text-lg whitespace-nowrap mr-2">{data?.name}</strong>
            <span className="text-xs">{linkIcon}</span>
          </div>

          <div className="text-sm text-zinc-400">{data?.description || 'No Description'}</div>
        </div>
        <div
          className="cursor-pointer text-base p-1 hover:opacity-70 duration-200 self-start"
          onClick={onClose}
        >
          {closeIcon}
        </div>
      </div>

      {/* content */}
      <Collapse title="information" defaultOpen>
        <DualCols>{['username', data?.username]}</DualCols>
        <DualCols>
          {[
            'password',
            <TextPassword
              value={data?.password}
              visible={globalPasswordMap[data?.id]}
              onCopy={() => triggerCopyPassword(data?.id, globalPasswordMap[data?.id])}
              onToggle={() => updatePasswordMap(data)}
            />,
          ]}
        </DualCols>
        <DualCols>{['URI', <a target='_blank' href={data?.uri} className="hover:text-sky-600">{data?.uri}</a>]}</DualCols>
        <DualCols>{['modified', data?.modified]}</DualCols>
        {/* <DualCols>{['modified By', data?.modifiedBy]}</DualCols> */}
        <DualCols>{['created', data?.created]}</DualCols>
        {/* <DualCols>{['created by', data?.createdBy]}</DualCols> */}
        <DualCols>{['location', data?.location]}</DualCols>
      </Collapse>
      <Collapse title="description">{data?.description}</Collapse>
    </div>
  );
}
