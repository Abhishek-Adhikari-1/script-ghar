import { LuEllipsis } from "react-icons/lu";

const DataCard = async ({
  type = "N/A",
  value = "1,234",
}: {
  type?: string;
  value?: string;
}) => {
  return (
    <div className="px-4 py-3 flex-auto min-w-[130px] rounded-xl odd:text-green-500 dark:odd:text-green-100 even:text-blue-500 dark:even:text-blue-100 odd:bg-[#b8f6d5] dark:odd:bg-[#77cd9d] even:bg-[#b1c7ff] dark:even:bg-[#6486db]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-slate-50 dark:bg-slate-700/70 px-2 py-1 rounded-full">
          2024/25
        </span>
        <LuEllipsis className="cursor-pointer text-neutral-50" />
      </div>
      <h1 className="text-xl font-semibold my-1 truncate">{value}</h1>
      <h2 className="capitalize text-sm leading-3 font-medium text-zinc-600 dark:text-slate-100">
        {type}
      </h2>
    </div>
  );
};

export default DataCard;
