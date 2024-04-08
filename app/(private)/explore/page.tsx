import Header from "@/components/ui/Header";
import Image from "next/image";
import React from "react";
import ExploreContent from "./components/ExploreContent";
import SearchInput from "@/components/SearchInput";
import getUsersBySearch from "@/actions/getUsersBySearch";

export const revalidate = 0;

interface ExploreProps {
  searchParams: {
    title: string;
  };
}

const Explore = async (props: ExploreProps) => {

  const { searchParams } = props;

  const allUsers = await getUsersBySearch(searchParams.title);


  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center gap-x-5">
            <div className="relative h-32 w-32 lg:h-44 lg:w-44">
              <Image
                fill
                src="https://picsum.photos/200/300"
                alt="playlist"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">
                Producers in:
              </p>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                NYC
              </h1>
            </div>
          </div>
        </div>
      </Header>

      <div className="mt-2 mb-7 px-6">
        <div className="flex align-middle items-center">
          <h1 className="text-white text-2xl font-semibold w-full">
            Producers in NYC
          </h1>

          <SearchInput
            baseRoute="/explore"
            placeholder="Search by producer name, city, state or genre"
          />

          {/* <div className='flex flex-row h-[50px] justify-center items-center align-middle bg-neutral-700 p-1 rounded-md'>
                <input className="bg-transparent pl-2 focus:outline-none text-sm w-full" placeholder='city or state' />
                <div className='border border-l-1 h-[20px] align-middle'/>
                <input className='bg-transparent pl-4 focus:outline-none text-sm w-full' placeholder='genre' />
            </div> */}

        </div>

        <ExploreContent allUsers={allUsers} />
        
      </div>
    </div>
  );
};

export default Explore;
