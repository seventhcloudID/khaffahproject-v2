import { useState } from "react";
import {
  // useForm,
  UseFormReturn,
  // Controller,
  FieldValues,
  Path,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
}

export function SelectDialog<T extends FieldValues>({ form, name }: Props<T>) {
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState("");

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Value</FormLabel>
          <FormControl>
            <div className="flex gap-2">
              <Input readOnly {...field} placeholder="No value selected" />
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="secondary">
                    Select
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Pick a Value</DialogTitle>
                  </DialogHeader>
                  {/* Here you can replace this with any selection UI */}
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setTempValue("Option A")}
                    >
                      Option A
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setTempValue("Option B")}
                    >
                      Option B
                    </Button>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={() => {
                        field.onChange(tempValue);
                        setOpen(false);
                      }}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
