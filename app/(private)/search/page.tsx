import getSongsByTitle from "@/actions/getSongsByTitle";
import Header from "@/components/ui/Header";
import SearchInput from "@/components/SearchInput";
import SearchContent from "./components/SearchContent";
import getLikedSongs from "@/actions/getLikedSongs";
import { Song } from "@/types";

interface SearchProps {
  searchParams: {
    search: string;
  };
}

export const revalidate = 0;

const Search = async (props: SearchProps) => {
  
  const { searchParams } = props;

  const songs = await getSongsByTitle(searchParams.search);

  const likedSongs = await getLikedSongs();

  // if I use likedSongs then it renders apporpiately but I need to unlink LikeButton so that it renders the right Heart

  return (
    <div
      className="
          bg-neutral-900
            rounded-lg
            h-full
            w-full
            overflow-hidden
            overflow-y-auto
        "
    >
      <Header className="from-bg-neutral-900">

        <div className="mb-2 flex flex-col gap-y-6">

          <h1 className="text-white text-3xl font-semibold"> Search </h1>

          <SearchInput placeholder=" What would you like to listen to? " />

          <div className="flex items-start justify-between px-1 ">
            <div className="w-[190px]"> Artist / Producer </div>
            <div> Key </div>
            <div> BPM </div>
            <div> Duration </div>
            <div> Genre(s) </div>
            <div> Liked </div>
          </div>
          <hr />
          
        </div>

      </Header>

      <SearchContent songs={songs} />
      
    </div>

  )

}


export default Search;
