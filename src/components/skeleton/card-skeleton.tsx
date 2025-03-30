import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

import { Skeleton } from "./skeleton";

export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("p-4 bg-white rounded-lg shadow-lg border border-gray-300", className)}>
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}