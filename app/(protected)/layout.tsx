import MaxWidthWrapper from "@/components/max-width-wrapper";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ProtectedHeader } from "./_components/header";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <MaxWidthWrapper className="py-[20px] h-full">
      <ProtectedHeader />
      <div className="mt-[50px]">{children}</div>
    </MaxWidthWrapper>
  );
};

export default DashboardLayout;
