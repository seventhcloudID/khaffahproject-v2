import Screen from "@/components/layout/screen";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";



interface UmrahFilterProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const UmrahFilter = ({ filters, activeFilter, onFilterChange }: UmrahFilterProps) => {
  return (
    <Screen className="p-8">
      <div className="flex items-center gap-6">
        <div className="flex-none">
          <Icon name="Filter" />
        </div>
        <div className="overflow-hidden">
          {/* Use a map to render buttons dynamically */}
          <div className="flex items-center gap-4 overflow-x-scroll md:overflow-auto pb-4">
            {filters.map((category) => (
              <button
                key={category}
                onClick={() => onFilterChange(category)}
                className={cn(
                  "border flex-none px-4 py-2 shadow-2xs rounded-2xl transition-colors whitespace-nowrap",
                  activeFilter === category
                    ? "bg-khaffah-primary text-white border-khaffah-primary" // Active state style
                    : "text-khaffah-primary hover:bg-khaffah-primary/10" // Inactive state style
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default UmrahFilter;
