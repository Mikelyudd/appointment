// src/components/booking/services/service-categories.tsx
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Category {
    id: string;
    name: string;
}

interface ServiceCategoriesProps {
    categories: Category[];
    activeCategory: string;
    onCategoryChange: (categoryId: string) => void;
}

export function ServiceCategories({
                                      categories,
                                      activeCategory,
                                      onCategoryChange,
                                  }: ServiceCategoriesProps) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <div className="flex gap-2">
                {categories.map((category) => (
                    <Button
                        key={category.id}
                        variant={activeCategory === category.id ? "default" : "outline"}
                        onClick={() => onCategoryChange(category.id)}
                        className="whitespace-nowrap"
                    >
                        {category.name}
                    </Button>
                ))}
            </div>
            <div className="flex items-center gap-2 ml-auto">
                <Button size="icon" variant="outline" className="shrink-0">
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" className="shrink-0">
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
