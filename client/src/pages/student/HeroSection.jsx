import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

const HeroSection = () => {
  return (
    <div className="relative w-full bg-gradient-to-r from-blue-600 to-violet-700 dark:from-stone-600 dark:to-zinc-700 flex flex-col justify-center items-center gap-7 text-white py-[2%] px-[15%] ">
      <h1 className="text-4xl font-extrabold">
        Empowering Minds, Achieving Goals....
      </h1>

      <p className="font-serif">
        We go beyond just hosting courses; we provide dynamic learning
        experiences that ignite curiosity and build critical skills, truly
        empowering minds to innovate and drive progress, thereby achieving goals
        that matter.
      </p>
      <form className="relative w-2/3">
        <Input
          type="search"
          placeholder="search courses"
          className="w-full border-0 focus-visible:ring-0 px-10 py-6 shadow-xl rounded-full bg-white text-slate-900  dark:bg-stone-500"
        />
        <Button className="absolute right-0 top-0 h-full px-6 bg-blue-600 hover:bg-blue-500 dark:bg-blue-900 dark:text-blue-200 rounded-tr-full rounded-br-full cursor-pointer">
          search
        </Button>
      </form>
    </div>
  );
};

export default HeroSection;
