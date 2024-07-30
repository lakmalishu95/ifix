"use client";

import http from "@/lib/http";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ArchiveHero = () => {
  const { user_id } = useParams();

  return (
    <div className="mt-[50px] pl-[20px]">
      <h1 className="font-bold text-[20px]">Archive Calls</h1>
      <Link className="underline" href={`/dashboard/call-center/${user_id}`}>Back</Link>
    </div>
  );
};
