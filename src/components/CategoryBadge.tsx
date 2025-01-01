import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const categoryColors: Record<string, string> = {
  Work: "bg-accent-blue text-blue-700",
  Personal: "bg-accent-peach text-orange-700",
  Shopping: "bg-primary-light text-primary-dark",
  Other: "bg-gray-200 text-gray-700",
};

export const CategoryBadge = ({ category, className }: CategoryBadgeProps) => {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium",
        categoryColors[category] || categoryColors.Other,
        className
      )}
    >
      {category}
    </span>
  );
};