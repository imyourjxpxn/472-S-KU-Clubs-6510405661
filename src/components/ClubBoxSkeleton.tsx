import { Skeleton } from "./skeleton/skeleton";

export default function ClubBoxSkeleton() {
  return (
    <div className="flex flex-col justify-between h-44 border border-gray-200 p-4 rounded-lg bg-white w-full">
      <div className="space-y-1">
        <div className="flex gap-1">
          <Skeleton className="h-[16px] w-[70px]" />
          <Skeleton className="h-[16px] w-[50px]" />
        </div>
        <div className="flex justify-between items-start gap-1">
          <Skeleton className="h-[28px] w-full" />
          <Skeleton className="h-[24px] w-[24px]" />
        </div>
      </div>
      <Skeleton className="h-[28px] w-[112px] rounded-3xl" />
    </div>
  );
}
