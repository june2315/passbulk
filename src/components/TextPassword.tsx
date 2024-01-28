import { eyeIcon, eyeOff } from '@/components/Icons';

export default function TextPassword(props: any) {
  const { value, onCopy, visible, onToggle, onClick } = props;
  return (
    <div className="group flex space-x-3 items-center min-h-[22px]" onClick={onClick}>
      <div onClick={onCopy} className="text-base leading-none ">
        {visible ? (
          <span className="inline-block pointer-events-none">{value}</span>
        ) : (
          <span className="inline-block group/pwd font-bold tracking-tighter cursor-pointer hover:text-primary-red">
            {/* ﹡﹡﹡﹡﹡﹡ */}
            {Array.from({ length: 9 }).map(() => (
              <i className="w-[9px] h-[9px] inline-block bg-white group-hover/pwd:bg-[#ff0000] mx-[2px] rounded-full"></i>
            ))}
          </span>
        )}
      </div>
      <i
        className="cursor-pointer hover-icon-primary hidden group-hover:inline-block"
        onClick={onToggle}
      >
        {visible ? eyeOff : eyeIcon}
      </i>
    </div>
  );
}
