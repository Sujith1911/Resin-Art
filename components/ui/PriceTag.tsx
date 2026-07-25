import React from "react";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  priceINR: number;
  compareAtPriceINR?: number;
  showGSTNotice?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function PriceTag({ priceINR, compareAtPriceINR, showGSTNotice = false, size = "md", className }: PriceTagProps) {
  const isDiscounted = compareAtPriceINR && compareAtPriceINR > priceINR;
  const discountPercent = isDiscounted
    ? Math.round(((compareAtPriceINR - priceINR) / compareAtPriceINR) * 100)
    : 0;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base font-semibold",
    lg: "text-xl font-bold",
    xl: "text-2xl font-bold tracking-wide",
  };

  return (
    <div className={cn("inline-flex flex-col gap-0.5", className)}>
      <div className="flex items-baseline gap-2">
        <span className={cn("text-primary-forest dark:text-emerald-300 font-serif", sizeClasses[size])}>
          {formatINR(priceINR)}
        </span>

        {isDiscounted && (
          <>
            <span className="text-xs sm:text-sm text-muted-foreground line-through decoration-rose-500/60 font-sans">
              {formatINR(compareAtPriceINR)}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
              {discountPercent}% OFF
            </span>
          </>
        )}
      </div>

      {showGSTNotice && (
        <span className="text-[10px] text-muted-foreground font-sans tracking-tight">
          Inclusive of all taxes (18% GST included)
        </span>
      )}
    </div>
  );
}
