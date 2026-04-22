import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";

export const SUB_BRAND_NAMES = ["Prepared response™", "Signal™", "Compass™", "Retrospect™"] as const;
export type SubBrandName = typeof SUB_BRAND_NAMES[number];

interface SubBrandLabelProps {
  name: string;
  size?: number;
  className?: string;
}

export function SubBrandLabel({ name, size = 14, className = "" }: SubBrandLabelProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <VaughnMartinLogo variant="icon-only" height={size} />
      {name}
    </span>
  );
}

export function isSubBrand(value: string): boolean {
  return (SUB_BRAND_NAMES as readonly string[]).includes(value);
}
