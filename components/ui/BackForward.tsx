"use client";

import { useRouter } from "next/navigation";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";

export default function BackForward() {
  const { back, forward } = useRouter();
  return (
    <div className="hidden md:flex gap-x-2 items-center">
      <button
        onClick={back}
        className="
              rounded-full 
              bg-black 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
      >
        <RxCaretLeft className="text-white" size={35} />
      </button>

      <button
        onClick={forward}
        className="
              rounded-full 
              bg-black 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
      >
        <RxCaretRight className="text-white" size={35} />
      </button>
    </div>
  );
}
