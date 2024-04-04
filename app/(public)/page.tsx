import { PiMicrophoneStageFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import useAuthModal from "@/hooks/useAuthModal";
import Button from "@/components/Button";

export const revalidate = 0;

const Home = () => {
  const authModal = useAuthModal();
  return (
    <div
      className={twMerge(
        `
    h-fit 
    bg-gradient-to-b 
    from-emerald-800 
    p-6
    `
      )}
    >
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <PiMicrophoneStageFill size={35} />
        </div>

        <div className="flex justify-between items-center gap-x-4">
          <div>
            <Button
              onClick={authModal.onOpen}
              className="
                bg-transparent 
                text-neutral-300 
                font-medium
              "
            >
              Sign up
            </Button>
          </div>
          <div>
            <Button onClick={authModal.onOpen} className="bg-white px-6 py-2">
              Log in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
