import { twMerge } from "tailwind-merge";
import Button from "@/components/Button";
import { GiSoundWaves } from "react-icons/gi";
import Link from "next/link";
import InSessionLogo from '../../public/images/GAMAL LOGO 1.png'
import Image from "next/image";

export const revalidate = 0;

const Home = () => {

  // bg-gradient-to-b from-emerald-800 

  return (
    <div className={twMerge(`h-fit bg-gradient-to-b from-orange-600 p-6`)} >

          <div className="w-full mb-4 flex items-center justify-between">

              <div className="hidden md:flex gap-x-2 items-center">
              <GiSoundWaves size={60}/> <h1 className="text-2xl font-bold"> InSession </h1>
                  {/* <Image height={100} src={InSessionLogo} alt="logo" />
                 <h1 className="text-2xl font-bold"> InSession </h1>  */}
              </div>

            <div className="flex justify-between items-center gap-x-4">

              <Link href="/signup">
                <Button
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
                  className="bg-white px-6 py-2"
                >
                  Log in
                </Button>
              </Link>

            </div>

          </div>



    <div className="w-full border">

      <div>
        A platform for producers and artist to connect. 
      </div>



    </div>


    





    </div>
  )
}

export default Home;
