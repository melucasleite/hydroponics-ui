"use client";
import React from "react";
import LeafIcon from "@/public/leaf.svg";

interface NutrientProps {
  ec: number;
}
export const Nutrient: React.FC<NutrientProps> = ({ ec }) => {
  const ecLevel = ec < 1.0 ? "low" : ec > 2 ? "high" : "normal";

  const color = {
    low: "fill-blue-200",
    normal: "fill-primary",
    high: "fill-red-500",
  };

  const Icon = LeafIcon;

  return (
    <div className={`flex items-center`}>
      <div className="tooltip tooltip-right" data-tip={`EC: ${ec}`}>
        <Icon className={`w-[42px] h-[42px] ${color[ecLevel]}`} />
        <p>{ec}</p>
      </div>
    </div>
  );
};
