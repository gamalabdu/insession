import Link from 'next/link';
import React from 'react';

type PricingCardInfo = {
    planName: string,
    planSubInfo: string,
    bandwidth: string,
    description: string,
    fee: string,
    planFee: number
}

interface PricingCardProps {
    card: PricingCardInfo
}

const PricingCard = ({ card }: PricingCardProps) => {
    return (
        <div className="w-full md:w-1/3 p-8 bg-neutral-700 rounded-lg shadow-md transition-shadow hover:shadow-lg">
            <div className="bg-orange-200 text-orange-600 px-2 py-1 inline-block rounded mb-4">{card.fee} fee</div>
            <h2 className="text-xl md:text-2xl" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)' }}>{card.planName}</h2>
            <h5 className="text-neutral-400" style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}>{card.planSubInfo}</h5>
            <div className="mt-8">
                <div className="text-neutral-300 my-2">Bandwidth<span className="float-right text-neutral-400">{card.bandwidth}</span></div>
                <div className="text-neutral-300 my-2">Transaction Fee<span className="float-right text-neutral-400">{card.fee}</span></div>
                <div className="text-neutral-300 my-2">
                    Description
                    <span className="float-right text-neutral-400 text-sm">{card.description}</span>
                </div>
            </div>
            <div className="text-center text-orange-600 my-8" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>${card.planFee}/month</div>
            <Link href="#" className="block text-center text-neutral-300 bg-orange-600 py-3 rounded hover:bg-orange-800 transition-colors">Get Started</Link>
        </div>
    );
}

export default PricingCard;
