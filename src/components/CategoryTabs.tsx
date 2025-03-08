import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CategoryTabsProps {
  activeCategory: string;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
}

interface CategoryInfo {
  id: string;
  label: string;
  description: string;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  setActiveCategory,
}) => {
  const categories: CategoryInfo[] = [
    {
      id: "Novillos",
      label: "NO | Novillos",
      description: "Machos castrados de 431 a 520 kg",
    },
    {
      id: "Novillitos",
      label: "NT | Novillitos",
      description: "Machos castrados de 351 a 390 kg",
    },
    {
      id: "Vaquillonas",
      label: "VQ | Vaquillonas",
      description: "Hembras jóvenes de 351 a 390 kg",
    },
    {
      id: "Vacas",
      label: "VA | Vacas",
      description: "Hembras adultas de más de 430 kg",
    },
    {
      id: "Toros",
      label: "TO | Toros",
      description: "Machos enteros adultos de más de 520 kg",
    },
  ];

  return (
    <TooltipProvider>
      <div className="mb-12 w-full overflow-x-auto">
        <div className="flex flex-nowrap md:flex-wrap gap-2 md:gap-4 justify-start md:justify-center min-w-full px-4 md:px-0">
          {categories.map((category) => (
            <Tooltip key={category.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    whitespace-nowrap flex items-center px-3 gap-2 py-2 rounded-lg transition-all duration-200
                    hover:bg-blue-50 dark:hover:bg-blue-950 relative
                    ${activeCategory === category.id
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"}
                  `}
                >
                  <span>{category.label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{category.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CategoryTabs;
