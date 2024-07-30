import { Loader2 } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="fixed bg-background top-0 right-0 left-0 bottom-0 flex justify-center items-center">
      <Loader2 className="animate-spin" /> <span>Loading</span>
    </div>
  );
};
export default LoadingPage;
