"use client";
import { useState } from "react";
import { DownloadIcon, Loader2 } from "lucide-react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CsvButtonProps {
  data: any[]; // Data to be downloaded as CSV
  filenamem: string; // Name of the CSV file
  disable?: boolean;
}

export const DownloadButton = ({
  data,
  filenamem,
  disable,
}: CsvButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    // Map data to desired format
    const parseData = data.map((d) => ({
      Title: d.title,
      Contacts: d.contacts[0],
      Notes: d.notes,
      Service: d.metadata.service,
    }));

    // Convert data to CSV format
    const csv = Papa.unparse(parseData);

    // Create Blob object
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });

    // Create object URL
    const url = URL.createObjectURL(blob);

    // Create anchor element
    const a = document.createElement("a");
    a.href = url;
    a.download = filenamem;

    // Simulate click on anchor element
    document.body.appendChild(a);
    a.click();

    // Cleanup
    URL.revokeObjectURL(url);
    document.body.removeChild(a);

    setLoading(false);
  };

  return (
    <div
      className={cn(disable && "opacity-30 pointer-events-none")}
      onClick={handleDownload}
    >
      <div className="flex items-center  py-[5px] px-[10px] rounded-md text-[12px] space-x-[10px] w-full relative cursor-pointer">
        {loading ? (
          <Loader2 className="animate-spin absolute top-0 left-0 right-0 bottom-0" />
        ) : (
          <DownloadIcon className="cursor-pointer" size={14} />
        )}
        <span className="text-[12px]">CSV</span>
      </div>
    </div>
  );
};
