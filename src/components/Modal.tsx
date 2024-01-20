import classNames from 'classnames';
import Button from './Button';
import { useRef, memo } from 'react';
import type { MutableRefObject } from 'react';
import { useDebounceEffect, useSetState, useUpdateEffect } from 'ahooks';
import { modalCloseIcon } from './Icons';

function Modal(props: any) {
  const {
    title,
    children,
    cancelText,
    okText,
    open,
    onClose,
    onOk,
    top = 30,
    width = 520,
    okButtonProps = {},
  } = props;

  const [state, setState] = useSetState({
    open: false,
    bgShow: false,
    leaving: false,
  });
  const panelRef: MutableRefObject<any> = useRef();
  // const openState = useRef(false);
  const zoomIn = 'animate-[zoomIn_0.3s_ease-out]';
  const zoomOut = 'animate-[zoomOut_0.3s_ease-in_forwards]';
  const origin = useRef({ x: 0, y: 0 });
  function keyup(event) {
    if (event.code === 'Escape') {
      onClose?.();
    }
  }

  function mousedown(e) {
    // x 相对于弹框 left 的位置
    origin.current.x = e.clientX - (window.innerWidth - width) / 2;
    origin.current.y = e.clientY - top;
    // console.log('origin', origin, rect);
    // panelRef!.current!.style!.transformOrigin = `${e.clientX}px ${e.clientY}px`;
  }

  useUpdateEffect(() => {
    if (open) {
      // console.log(document.elementFromPoint);
      panelRef?.current?.classList?.remove?.(zoomOut);
      panelRef?.current?.classList?.add?.(zoomIn);
      panelRef!.current!.onanimationend = null;
      setState({ open: open });
      setTimeout(() => {
        setState({ bgShow: true });
      }, 22);
    } else {
      panelRef?.current?.classList?.remove?.(zoomIn);
      panelRef?.current?.classList?.add?.(zoomOut);
      setState({ leaving: true, bgShow: false });
      setTimeout(() => {
        setState({ open: open, leaving: false });
        // document.addEventListener('mousedown', mousedown);
      }, 200);
    }
  }, [open]);

  useDebounceEffect(
    () => {
      document.removeEventListener('keyup', keyup);
      document.removeEventListener('mousedown', mousedown);
      document.addEventListener('keyup', keyup);
      document.addEventListener('mousedown', mousedown);
      return () => {
        document.removeEventListener('keyup', keyup);
        document.removeEventListener('mousedown', mousedown);
      };
    },
    [],
    { wait: 500 }
  );

  return (
    <div
      className={classNames(state.open ? 'block' : 'hidden')}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className={classNames(
          'fixed inset-0 z-10 bg-zinc-700/60 transition-opacity duration-300 opacity-0 data-[open=true]:opacity-100 data-[leaving=true]:opacity-0 will-change-[opacity]'
        )}
        onClick={onClose}
        data-open={state.bgShow}
        data-leaving={state.leaving}
      ></div>
      <div className={classNames('fixed inset-0 z-50 p-4 sm:p-0')}>
        <div
          ref={panelRef}
          style={{
            transformOrigin: `${origin.current.x}px ${origin.current.y}px`,
            width: width + 'px',
            top: top + 'px',
            // transformOrigin: `0px 0px`,
          }}
          className={classNames(
            // `top-[${top}px]`,
            // `w-[${width}px]`,
            // `sm:max-w-[${width}px]`,
            'relative mx-auto overflow-hidden rounded-sm bg-white dark:bg-neutral-800 dark:text-white shadow-xl will-change-transform'
          )}
        >
          <div className="relative p-4 dark:bg-neutral-700">
            <button
              type="button"
              className="absolute top-4 right-4 rounded-lg p-1 text-center font-medium transition-all hover:text-white/50"
              onClick={onClose}
            >
              {modalCloseIcon}
            </button>
            <h3 className="text-lg font-bold text-secondary-900 dark:text-white">{title}</h3>
          </div>
          <div className="p-4">
            <div className="mt-2 text-sm text-secondary-500 dark:text-white">{children}</div>
          </div>
          <div className="flex justify-end gap-3 bg-secondary-50 dark:bg-neutral-700 px-4 py-3">
            <button
              type="button"
              className="rounded-sm px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-white shadow-sm transition-all hover:text-white/50 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400"
              onClick={onClose}
            >
              {cancelText || 'Cancel'}
            </button>

            <Button {...okButtonProps} primary className="h-[40px] px-4 rounded-sm" onClick={onOk}>
              {okText || 'Confirm'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Modal);
