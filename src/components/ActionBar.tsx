export default function ActionBar(props: any) {
    return (
        <div className="flex pb-4 px-4 items-center bg-search-gray">
            <div className="min-w-[18rem]">{props.extraLeft}</div>
            <div className="flex-1">{props.children}</div>
            <div>{props.extraRight}</div>
        </div>
    );
}
