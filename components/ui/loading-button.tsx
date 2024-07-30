import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Loader2Icon } from "lucide-react";

interface LoadingButtonProps {
  children: string;
  loading?: boolean;
  className?: string;
  variant?: any;
  type?: "button" | "reset" | "submit";
}

export const LoadingButton = ({
  children,
  loading,
  className,
  variant,
}: LoadingButtonProps) => {
  return (
    <Button
      variant={variant}
      disabled={loading}
      className={cn(className)}
    >
      {loading ? <Loader2Icon className="animate-spin" /> : children}
    </Button>
  );
};
