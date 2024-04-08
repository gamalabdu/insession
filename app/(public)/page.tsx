import { PiMicrophoneStageFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import useAuthModal from "@/hooks/useAuthModal";
import Button from "@/components/Button";
import { GiSoundWaves } from "react-icons/gi";
import Link from "next/link";

export const revalidate = 0;

const Home = () => {
  
  // const authModal = useAuthModal();

  // bg-gradient-to-b from-emerald-800 

  return (
    <div
      className={twMerge(
        `
    h-fit 
    bg-gradient-to-b from-orange-600 
    p-6
    `
      )}
    >
      <div className="w-full mb-4 flex items-center justify-between">

        <div className="hidden md:flex gap-x-2 items-center">
        <GiSoundWaves size={40}/>
        </div>

        <div className="flex justify-between items-center gap-x-4">

          <Link href="/signup">
            <Button
              // onClick={authModal.onOpen}
              className="
                bg-transparent 
                text-neutral-300 
                font-medium
              "
            >
              Sign up
            </Button>
          </Link>


          <Link href="/login">
            <Button
              // onClick={authModal.onOpen}
              className="bg-white px-6 py-2"
            >
              Log in
            </Button>
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Home;
