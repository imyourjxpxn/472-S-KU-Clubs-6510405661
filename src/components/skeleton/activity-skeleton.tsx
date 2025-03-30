import { Skeleton } from "./skeleton"

export function ActivitySkeleton() {
  return (
    <div className="mb-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <Skeleton className="h-6 w-[60%]" />
        <Skeleton className="h-4 w-[20%]" />
      </div>
      <div className="flex items-center mb-3">
        <Skeleton className="h-5 w-5 mr-1 rounded-full" />
        <Skeleton className="h-4 w-[30%] mr-4" />
        <Skeleton className="h-5 w-5 mr-1 rounded-full" />
        <Skeleton className="h-4 w-[20%]" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[90%] mt-1" />
    </div>
  )
}