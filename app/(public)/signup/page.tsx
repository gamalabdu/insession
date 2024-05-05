import "./styles.css";
import Form from "./components/form";

import Link from "next/link";
import { GiSoundWaves } from "react-icons/gi";
import { twMerge } from "tailwind-merge";
import Button from "@/components/Button";

const SignUp = () => {
  //   const handleInputChange = (
  //     e: React.ChangeEvent<HTMLInputElement>,
  //     type: string
  //   ) => {
  //     if (type === "username") {
  //       setUsername(e.target.value);
  //     } else if (type === "password") {
  //       setPassword(e.target.value);
  //     } else if (type === "email") {
  //       setEmail(e.target.value);
  //     }
  //   };

  //   const handleInputBlur = (type: string) => {
  //     if (type === "username" && !username.trim()) {
  //       // Reset the label position if the username is empty
  //       setUsername("");
  //     } else if (type === "password" && !password.trim()) {
  //       // Reset the label position if the password is empty
  //       setPassword("");
  //     }
  //   };

  // if (user) {
  //     return router.push("/dashboard")
  // }

  return (
    <div className="h-full w-full">

    <div
        className={twMerge(`h-[120px] bg-gradient-to-b from-orange-600 p-6`)}
      >
        <div className="w-full mb-4 flex items-center justify-between">
          <div className="hidden md:flex gap-x-2 items-center">
            <GiSoundWaves size={40} />
            <h1 className="text-2xl font-bold">InSession</h1>
          </div>
          <div className="flex justify-between items-center gap-x-4">
          <Link href="/pricing">
              <Button className="bg-transparent text-neutral-300 font-medium">
                Pricing
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-transparent text-neutral-300 font-medium">
                Sign up
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-white px-6 py-2">Log in</Button>
            </Link>
          </div>
        </div>
      </div>


      <div className="min-h-[calc(100vh-120px)] flex items-center align-middle justify-center">
        <Form />
      </div>

    </div>
  );
};

export default SignUp;
