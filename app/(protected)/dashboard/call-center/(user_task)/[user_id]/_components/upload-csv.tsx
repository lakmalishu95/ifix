"use client";
import { Button } from "@/components/ui/button";
import useUser from "@/hooks/user";
import http from "@/lib/http";
import callCenter from "@/model/call-center";
import { Loader2, Upload } from "lucide-react";
import { useParams } from "next/navigation";
import Papa from "papaparse";
import { useState } from "react";

interface CsvButtonProps {
  colId: string;
  callBack: () => void;
}

export const CsvButton = ({ colId, callBack }: CsvButtonProps) => {
  const [data, setData] = useState<any>();
  const [loading, setLoadig] = useState(false);

  const params = useParams();
  const { user_id } = params;
  const { user } = useUser();

  const handlerFileChnager = async (event: any) => {
    setLoadig(true);

    Papa.parse(event.target.files[0], {
      skipEmptyLines: true,
      complete: async function (result) {
        const data = result.data;
        const parsedData = data.map((item: any) => ({
          title: item[0],
          contacts: [item[1]],
          notes: item[2],
          metadata: {
            service: item[3],
          },
          createdBy: `${user.name.first_name} ${user.name.last_name.charAt(0)}`,
        }));

        setData(parsedData.slice(1));
        await http
          .post("/call-center/task/bulk", {
            user_id,
            colId,
            data: parsedData.slice(1),
          })
          .then((res) => {
            callBack();
            // const ar = Object.values(res.data);
            // console.log(res.data);
          })
          .finally(() => setLoadig(false));
      },
    });
  };
  return (
    <div className="cursor-pointer">
      <div
        // disabled={loading}
        // variant="ghost"/
        className="flex items-center text-[16px] space-x-[10px] w-full relative cursor-pointer   py-[5px] px-[10px] rounded-md "
      >
        {loading ? (
          <Loader2 className="animate-spin absolute top-0 left-0 right-0 bottom-0" />
        ) : (
          <>
            <Upload className="cursor-pointer" size={14} />
          </>
        )}
        <span className="text-[12px]">CSV</span>

        <input
          onChange={handlerFileChnager}
          type="file"
          className="opacity-0 absolute cursor-pointer top-0 right-0 left-[-10px] bottom-0"
        />
      </div>
    </div>
  );
};
