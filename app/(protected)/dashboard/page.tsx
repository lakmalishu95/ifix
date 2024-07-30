import MaxWidthWrapper from "@/components/max-width-wrapper";
import { PhoneCall } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { DashboardHero } from "../_components/hero";

const DashboardPage = () => {
  return (
    <main>
      <MaxWidthWrapper className="px-[100px]">
        <div className="mt-[100px]">
          <DashboardHero />
        </div>
        <div className="flex">
          <Link href="/dashboard/call-center" className="w-full max-w-[450px]">
            <div className="mt-[20px] w-full border py-[20px] px-[20px] max-w-[450px] rounded-lg dark:hover:bg-primary-foreground hover:bg-primary/20 duration-300 hover:scale-105">
              <h5 className="font-bold text-[18px] flex items-center space-x-[10px]">
                <PhoneCall className="stroke-primary size-[20px]" />{" "}
                <span>Call Center</span>
              </h5>
              <hr className="my-[10px]" />
              <div>
                <p>Last Login: 2024 Feb | 8:45PM</p>
              </div>
            </div>
          </Link>
        </div>
      </MaxWidthWrapper>
    </main>
  );
};

export default DashboardPage;
