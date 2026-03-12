"use client";
import {
  FormField,
  FormControl,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

// Menambahkan tipe untuk rules yang lebih spesifik
interface PasswordFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  rules?: {
    required?: boolean | string;
    minLength?: {
      value: number;
      message: string;
    };
    validate?: (value: string) => string | boolean;
  };
}

export const PasswordField = <T extends FieldValues>({
  name,
  label,
  placeholder,
  rules,
}: PasswordFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useFormContext<T>(); // Gunakan form context yang sudah sesuai tipe

  return (
    <FormField
      control={form.control}
      name={name}
      rules={rules} // Gunakan rules yang sudah spesifik
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                className={cn(
                  "bg-khaffah-neutral-light placeholder:text-khaffah-neutral-dark py-6 px-4",
                  fieldState.error && "border-destructive"
                )}
                placeholder={placeholder}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" stroke="#007b6f" />
                ) : (
                  <Eye className="h-5 w-5" stroke="#007b6f" />
                )}
              </Button>
            </div>
          </FormControl>

          {/* Pesan error validasi */}
          {fieldState?.error && (
            <FormMessage>{fieldState?.error?.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};
