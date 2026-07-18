"use client";

import { Scale, ShieldCheck, RefreshCcw } from "lucide-react";
import { Features, type Feature } from "@/components/ui/features";

const BIDFAIR_FEATURES: Feature[] = [
  {
    id: 1,
    icon: Scale,
    title: "One fair price for everyone",
    description:
      "Everyone pays the same clearing price — no surge, no gouging. The markup scalpers would skim stays in your pocket.",
    image: "/features/fair-price.png",
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: "Bots and scalpers locked out",
    description:
      "Verified fans only. One person, one allocation — real fans get the tickets, not resale bots.",
    image: "/features/no-scalpers.png",
  },
  {
    id: 3,
    icon: RefreshCcw,
    title: "Escrow-backed instant refunds",
    description:
      "Pledge with confidence. You only ever pay the final clearing price, and the difference is refunded automatically.",
    image: "/features/refunds.png",
  },
];

export function HomeFeatures() {
  return (
    <Features
      eyebrow="Fair price · Real fans · No scalpers"
      heading="BidFair hands it back to you."
      features={BIDFAIR_FEATURES}
    />
  );
}
