"use client";

import useUser from "@/hooks/user";
import { getRandomRelaxingQuote } from "@/lib/random-quots";

export const DashboardHero = () => {
  const { user } = useUser();

  const quouts = getRandomRelaxingQuote();
  return (
    <div className="border-b-[2px] pb-[20px]">
      {user && (
        <>
          <h1 className="text-[32px] font-bold capitalize">
            Hi Welcome, {user?.name.first_name} {user?.name.last_name.charAt(0)}
            . ✌
          </h1>
          <p className="mt-[-5px] font-medium text-gray-600">{quouts}</p>
          <h3 className="mt-[20px] text-[18px] font-medium ">{`${user?.name.first_name}'s Workplaces 👇`}</h3>
        </>
      )}
    </div>
  );
};
