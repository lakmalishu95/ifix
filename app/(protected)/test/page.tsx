"use client";

import useUser from "@/hooks/user";
import http from "@/lib/http";
import { pusherClient } from "@/lib/pusher";
import { useEffect, useState } from "react";

export default function Page() {
  const [status, setStatus] = useState(false);
  const [_status, _setStatus] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    pusherClient.subscribe("65daaf1409d913ef1f389876");

    pusherClient.bind("online-status-update", (status: boolean) => {
      _setStatus(status);
    });

    return () => {
      pusherClient.unsubscribe("65daaf1409d913ef1f389876");
    };
  }, []);

  const sendStatus = async () => {
    setStatus(!status);
    await http
      .post("/user/status", {
        status: status,
        user_id: "65daaf1409d913ef1f389876",
      })
      .then((res) => {
        console.log(res.data);
      });
  };
  return (
    <div>
      HelloTest
      <button onClick={sendStatus}>Click Online</button>
      <br />
      <p>{_status ? "online" : "Offline"}</p>
    </div>
  );
}
