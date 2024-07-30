import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-full flex justify-center items-center w-full bg-black">
      <div className="flex flex-col items-center">
        <div className="h-[40rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
          <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
            Ifix
          </h1>

          <div className="w-[40rem] h-40 relative">
            {/* Gradients */}
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
            <div className="z-50 flex justify-center absolute left-0 right-0">
              <div className="flex flex-col items-center">
                <Link
                  className="bg-blue-400 py-[5px] px-[20x] w-full max-w-[220px] rounded-xl flex justify-center items-center mt-[20px] font-bold text-[20px] hover:scale-105 duration-300"
                  href="/auth/login"
                >
                  <span>Login Member</span>
                </Link>
                <div className="text-white mt-[20px] text-[14px]">
                  <span className="opacity-75">Developed by{" "}</span>
                  <Link className="opacity-100" href="https://sasinduk.vercel.app" target="_blank">
                    Sasindu K.
                  </Link>{" "}
                  <span className="opacity-75">with ❤️.</span>
                </div>
              </div>
            </div>

            {/* Core component */}
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />

            {/* Radial Gradient to prevent sharp edges */}
            <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
