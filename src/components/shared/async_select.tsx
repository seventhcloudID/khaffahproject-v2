"use client";

import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface Props<T extends FieldValues> {
  name: Path<T>;
  /** Jika diisi, nilai label (nama) opsi yang dipilih juga disimpan ke path ini (untuk tampil di ringkasan/backend) */
  labelPath?: Path<T>;
  label?: string;
  triggerPlaceholder?: string;
  inputPlaceholder?: string;
  fetcher: (search: string) => Promise<Option[]>;
  /**
   * Jika true, maka fetcher akan dipanggil sekali di awal
   * untuk menampilkan initial options (berguna saat edit form)
   */
  initialValue?: boolean;
  dependencies?: unknown[];
}

export function AsyncSelect<T extends FieldValues>({
  name,
  labelPath,
  label = "Select Item",
  inputPlaceholder = "Search...",
  triggerPlaceholder = "Select...",
  initialValue = false,
  fetcher,
  dependencies = [],
}: Props<T>) {
  const form = useFormContext<T>();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const selectedLabel = useMemo(() => {
    const currentValue = form.getValues(name);
    const selected = options.find((opt) => {
      // Handle both string and number comparisons
      const optValue = typeof currentValue === 'number' ? Number(opt.value) : opt.value;
      return optValue === currentValue;
    });
    return selected?.label;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, form.watch(name), name, form]); // re-run if options or field value changes

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!debouncedSearch && !initialValue) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const data = await fetcher(debouncedSearch);
        if (isMounted) setOptions(data);
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, initialValue, JSON.stringify(dependencies)]);

  // Fetch initial label for pre-filled value (edit mode)
  useEffect(() => {
    const currentValue = form.getValues(name);
    if (initialValue && currentValue && options.length === 0) {
      fetcher("").then((data) => setOptions(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue, form, name, options.length]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between p-6",
                    fieldState.error && "border-destructive"
                  )}
                  onClick={() => setOpen(true)}
                  type="button"
                >
                  {selectedLabel || triggerPlaceholder}
                  <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-2 w-[var(--radix-popover-trigger-width)]">
              <Input
                placeholder={inputPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-2 w-full"
              />

              {loading ? (
                <p className="text-sm text-gray-500 p-2">Loading...</p>
              ) : options.length ? (
                <ul className="max-h-48 overflow-auto">
                  {options.map((item) => (
                    <li
                      key={item.value}
                      className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                      onClick={() => {
                        const formValue = form.getValues(name);
                        const isNumericField = typeof formValue === 'number' || (formValue === undefined && name.includes('_id'));
                        const value = isNumericField ? Number(item.value) : item.value;
                        field.onChange(value);
                        if (labelPath) form.setValue(labelPath, item.label as T[Path<T>]);
                        setOpen(false);
                      }}
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 p-2">No results found</p>
              )}
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
