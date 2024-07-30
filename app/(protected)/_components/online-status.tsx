"use client";
import useUser from "@/hooks/user";
import http from "@/lib/http";
import { useState, useEffect } from "react";

const OnlineStatusUpdater = () => {
  const { user } = useUser();
  const [onlineStatus, setOnlineStatus] = useState(true); // Assume online by default

  useEffect(() => {
    const handleVisibilityChange = () => {
      setOnlineStatus(
        document.visibilityState === "visible" && navigator.onLine
      );
    };

    const handleOnlineStatusChange = () => {
      setOnlineStatus(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const changeStatus = async () => {
    try {
      await http.post("/user/status", {
        status: onlineStatus,
        user_id: user?.id,
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      // Handle error appropriately, e.g., show a message to the user
    }
  };

  // Call changeStatus whenever onlineStatus changes
  useEffect(() => {
    changeStatus();
  }, [onlineStatus]);

  return null; // This component doesn't render anything visible
};

export default OnlineStatusUpdater;
