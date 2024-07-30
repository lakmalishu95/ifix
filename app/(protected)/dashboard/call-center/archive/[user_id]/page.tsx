import { ArchiveCalls } from "./_components/data-table";
import { ArchiveHero } from "./_components/hero";

const ArchivePage = () => {
  return (
    <div className="max-w-screen-xl w-full flex">
      <div className="flex flex-col   items-center w-full">
        <div className="w-full  flex flex-col">
          <ArchiveHero />
          <ArchiveCalls />
        </div>
      </div>
    </div>
  );
};
export default ArchivePage;
