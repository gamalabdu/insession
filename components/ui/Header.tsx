"use client"
import { twMerge } from "tailwind-merge";
import { FaUserAlt } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Button from "../Button";
import BackForward from "./BackForward";
import Link from "next/link";
import { signOut } from "@/actions/signOut";
import { FiMessageSquare } from "react-icons/fi";
import { MdOutlineTravelExplore, MdTableRows } from "react-icons/md";
import getUserProfileInfo from "@/actions/getUserProfileInfo";
import UserProfileMenu from "./UserProfileMenu";
import { useUser } from "@/hooks/useUser";



interface HeaderProps {
  children: React.ReactNode; 
  className?: string;
}

const Header = (props: HeaderProps) => {

  const { children, className } = props;

  const { userDetails } = useUser()

  return (
    <div
      className={twMerge(
        `
        h-fit 
        bg-gradient-to-b 
        from-orange-600 
        p-6
        `,
        className
      )}
    >
      <div className="w-full mb-4 flex items-center justify-between">
        <BackForward />

        <div className="flex md:hidden gap-x-2 items-center">
          <Link
            href="/dashboard"
            className="
              rounded-full 
              p-2 
              bg-white 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
          >
            <HiHome className="text-black" size={20} />
          </Link>

          <Link
            href="/explore"
            className="
              rounded-full 
              p-2 
              bg-white 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
          >
            <MdOutlineTravelExplore className="text-black" size={20} />
          </Link>

          <Link
            href="/search"
            className="
              rounded-full 
              p-2 
              bg-white 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
          >
            <BiSearch className="text-black" size={20} />
          </Link>

          <Link
            href="/messages"
            className="
              rounded-full 
              p-2 
              bg-white 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
          >
            <FiMessageSquare className="text-black" size={20} />
          </Link>

          <Link
            href="/sessions"
            className="
              rounded-full 
              p-2 
              bg-white 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
          >
            <MdTableRows className="text-black" size={20} />
          </Link>
        </div>
        <div className="flex justify-between items-center gap-x-4">
          <div className="flex gap-x-4 items-center">
            <form action={signOut}>
              <Button type="submit" className="bg-white px-6 py-2">
                Logout
              </Button>
            </form>

            {/* <Link href="/account"> */}

              {/* <Button asChild className="bg-white">
                
                <FaUserAlt />
              </Button> */}

                    {/* <Button asChild className="bg-transparent">
                    <div className="aspect-square h-[40px] relative rounded-full bg-gray-200">
                        <Image
                          src={userProfileInfo.avatar_url}
                          alt="User profile"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-full"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
              </Button> */}

            {/* </Link> */}


         { userDetails &&  <UserProfileMenu userProfileInfo={userDetails} /> }

          </div>
        </div>
      </div>

      {children}
    </div>
  );
};

export default Header;


