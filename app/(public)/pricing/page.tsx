import Button from "@/components/Button";
import Link from "next/link";
import React from "react";
import { GiSoundWaves } from "react-icons/gi";
import { twMerge } from "tailwind-merge";
import PricingCard from "./components/PricingCard";

type PricingCardInfo = {
  planName: string;
  planSubInfo: string;
  bandwidth: string;
  description: string;
  fee: string;
  planFee: number;
};

const page = () => {
  const pricingInfo: PricingCardInfo[] = [
    {
      planName: "Starter Plan",
      planSubInfo: "Made for starters",
      bandwidth: "50 GB",
      description:
        "Ideal for beginners or smaller operations, this free entry-level tier includes all basic features with a 20% transaction fee.",
      fee: "20%",
      planFee: 0,
    },
    {
      planName: "Growth Plan",
      planSubInfo: "Made for experienced users",
      bandwidth: "100 GB",
      description:
        "Designed for growing businesses seeking enhanced capabilities, this tier reduces the transaction fee to 10%.",
      fee: "10%",
      planFee: 9.99,
    },
    {
      planName: "Professional Plan",
      planSubInfo: "Made for professionals/agencies",
      bandwidth: "Unlimited Storage",
      description:
        "Best for high-volume users requiring advanced functionality, this premium tier offers 0% transaction fees, maximizing your earnings.",
      fee: "0%",
      planFee: 19.99,
    },
  ];

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

       <div className="min-h-[calc(100vh-120px)] flex items-center align-middle justify-center p-20"> {/* Adjusted for better overflow handling and vertical alignment */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full">
          {pricingInfo.map((card) => (
            <PricingCard key={card.planName} card={card} />
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default page;
