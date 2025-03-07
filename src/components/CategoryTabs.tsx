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
      label: "Novillos",
      description: "Bovinos machos castrados",
    },
    {
      id: "Novillitos",
      label: "Novillitos",
      description: "Bovinos machos jóvenes castrados",
    },
    {
      id: "Vaquillonas",
      label: "Vaquillonas",
      description: "Bovinos hembras jóvenes",
    },
    {
      id: "Vacas",
      label: "Vacas",
      description: "Bovinos hembras adultas",
    },
  ];

  return (
    <TooltipProvider>
      <div className="mb-6 w-full overflow-x-auto">
        <div className="flex flex-nowrap md:flex-wrap gap-2 md:gap-4 justify-start md:justify-center min-w-full px-4 md:px-0">
          {categories.map((category) => (
            <Tooltip key={category.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    whitespace-nowrap flex items-center px-3 gap-2 py-2 rounded-lg transition-all duration-200
                    hover:bg-blue-50 relative
                    ${activeCategory === category.id
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-blue-600"}
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
