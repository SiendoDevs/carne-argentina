import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

const LoadingSkeleton = memo(() => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-md p-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
      <Skeleton className="h-40 w-full mt-6" />
    </>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default LoadingSkeleton;