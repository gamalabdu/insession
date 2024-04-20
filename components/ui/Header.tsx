
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



interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header = (props: HeaderProps) => {

  const { children, className } = props;


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
            <Link href="/account">
              <Button asChild className="bg-white">
                {}
                <FaUserAlt />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
};

export default Header;

// server action for signing out
