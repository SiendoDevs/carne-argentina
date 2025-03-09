import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

const LoadingSkeleton = memo(() => {
  return (
    <>
      {/* PriceRanges Skeleton */}
      <div className="mt-2 mb-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-blue-500">
          <CardHeader className="pb-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-64" />
                </div>
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-36" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-100 dark:border-blue-900">
                <div className="text-center space-y-3">
                  <Skeleton className="h-6 w-32 mx-auto" />
                  <Skeleton className="h-4 w-36 mx-auto" />
                  <Skeleton className="h-10 w-48 mx-auto" />
                  <Skeleton className="h-6 w-40 mx-auto rounded-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-blue-500">
            <CardHeader className="pb-2">
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Support Local Skeleton */}
      <div className="mt-8">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
          </CardContent>
        </Card>
      </div>
    </>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default LoadingSkeleton;