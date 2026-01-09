// src/components/booking/steps/page-header.tsx
import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: string;
    description?: string;
    className?: string;
}

export function PageHeader({
                               title,
                               description,
                               className = ""
                           }: PageHeaderProps) {
    return (
        <header className={cn("mb-6", className)}>
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && (
                <p className="mt-2 text-sm text-gray-500">
                    {description}
                </p>
            )}
        </header>
    );
}
