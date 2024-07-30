import { cn } from "@/lib/utils";

interface FormErrorProps {
  error?: string;
  visible?: boolean
}

export const FormError = ({ error, visible }: FormErrorProps) => {
  return (
    <div className={cn("py-[10px] bg-red-300  justify-center rounded-md", visible ? "flex" : "hidden")}>
      <p className="font-medium text-[14px]">{error}</p>
    </div>
  );
};
