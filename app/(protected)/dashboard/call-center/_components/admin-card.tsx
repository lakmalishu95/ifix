"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import http from "@/lib/http";
import { cn } from "@/lib/utils";
import { RefreshCwIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const AdminCards = () => {
  const [taskData, setTaskData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const fetchCardData = async () => {
    setLoading(true);
    await http
      .get("/call-center/admin")
      .then((res) => {
        setTaskData(res.data);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    const fetchDataInterval = setInterval(fetchCardData, 30 * 60 * 1000); // Fetch data every 5 seconds

    return () => clearInterval(fetchDataInterval); // Cleanup interval on component unmount
  }, []);
  useEffect(() => {
    fetchCardData();
  }, []);
  return (
    <div>
      <Button
        disabled={loading}
        onClick={async () => {
          await fetchCardData();
        }}
        size="sm"
        variant="ghost"
        className="flex items-center text-[14px]"
      >
        <RefreshCwIcon
          className={cn("mr-[10px] size-[15px] ", loading && "animate-spin")}
        />{" "}
        Refresh
      </Button>
      <div className="flex mt-[20px] max-w-screen-xl justify-between">
        {/* {JSON.stringify(taskData)} */}
        {!loading ? (
          <>
            <Card className="bg-primary-foreground">
              <CardContent className="py-[10px]  ">
                <div className="min-w-[150px]">
                  <span>Total calls</span>
                  <h5 className="font-bold text-[30px]">
                    {taskData.totalCalls}
                  </h5>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground">
              <CardContent className="py-[10px]  ">
                <div className="min-w-[150px]">
                  <span> Positive Calls</span>
                  <h5 className="font-bold text-[30px] text-green-600 dark:text-green-400">
                    {taskData.positiveCalls}
                  </h5>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary-foreground min-h-[120px]">
              <CardContent className="py-[10px]  ">
                <div className="min-w-[150px]">
                  <span> No Answer Calls</span>
                  <h5 className="font-bold text-[30px] text-orange-600 dark:text-orange-400">
                    {taskData.noAnswerCalls}
                  </h5>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground min-h-[120px]">
              <CardContent className="py-[10px]  ">
                <div className="min-w-[150px]">
                  <span> Archive Calls</span>
                  <h5 className="font-bold text-[30px] text-red-600 dark:text-red-400">
                    {taskData.archiveCalls}
                  </h5>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground">
              <CardContent className="py-[10px]  ">
                <div className="min-w-[150px]">
                  <span> Confirm Calls</span>
                  <h5 className="font-bold text-[30px] text-blue-600 dark:text-blue-400">
                    {taskData.confirmCalls}
                  </h5>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {" "}
            <Skeleton className="h-[120px]  w-[200px]" />
            <Skeleton className="h-[120px]  w-[200px]" />
            <Skeleton className="h-[120px]  w-[200px]" />
            <Skeleton className="h-[120px]  w-[200px]" />
          </>
        )}
      </div>
    </div>
  );
};
