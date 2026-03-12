"use client";
import { useDropzone } from "react-dropzone";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import { Trash, File, Pen } from "lucide-react";

interface DropzoneFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  accept?: Record<string, string[]>;
  maxFiles?: number;
}

/** Komponen Dropzone untuk dipakai di dalam FormField */
function DropzoneInput({
  value,
  onChange,
  placeholder,
  accept,
  maxFiles,
}: {
  value: File | File[] | null;
  onChange: (file: File | File[] | null) => void;
  placeholder: string;
  accept?: Record<string, string[]>;
  maxFiles: number;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      onChange(maxFiles === 1 ? acceptedFiles[0] : acceptedFiles);
    },
    accept,
    maxFiles,
  });

  return (
    <Card
      {...getRootProps()}
      className={`border border-dashed rounded-lg text-center cursor-pointer ${
        isDragActive
          ? "bg-blue-100 border-blue-400"
          : "bg-white border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      {value ? (
        Array.isArray(value) ? (
          <ul className="text-sm space-y-1">
            {value.map((file: File, i: number) => (
              <li key={i}>{file.name}</li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 p-2 bg-khaffah-primary/20 rounded-xl">
                <File stroke="#007b6f" className="p-1  " />
              </div>
              <p>{value.name}</p>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="flex items-center gap-2 bg-khaffah-neutral-light border p-2 rounded-xl"
                type="button"
              >
                <Pen stroke="#007b6f" className="p-1 " />
                <p>Ubah</p>
              </button>
              <button
                className="flex items-center gap-2 bg-khaffah-neutral-light border p-2 rounded-xl"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
              >
                <Trash stroke="red" className="p-1 " />
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <svg
            width="54"
            height="54"
            viewBox="0 0 54 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 54C4.35 54 2.938 53.413 1.764 52.239C0.59 51.065 0.002 49.652 0 48V6C0 4.35 0.588 2.938 1.764 1.764C2.94 0.59 4.352 0.002 6 0H48C49.65 0 51.063 0.588 52.239 1.764C53.415 2.94 54.002 4.352 54 6V48C54 49.65 53.413 51.063 52.239 52.239C51.065 53.415 49.652 54.002 48 54H6ZM12 42H42C42.6 42 43.05 41.725 43.35 41.175C43.65 40.625 43.6 40.1 43.2 39.6L34.95 28.575C34.65 28.175 34.25 27.975 33.75 27.975C33.25 27.975 32.85 28.175 32.55 28.575L24.75 39L19.2 31.575C18.9 31.175 18.5 30.975 18 30.975C17.5 30.975 17.1 31.175 16.8 31.575L10.8 39.6C10.4 40.1 10.35 40.625 10.65 41.175C10.95 41.725 11.4 42 12 42Z"
              fill="#D1D5D8"
            />
          </svg>
          <div>
            <p className="text-black text-10 font-bold md:text-12 lg:text-14">
              {placeholder}
            </p>
            <p className="text-8 md:text-10 lg:text-12 text-khaffah-neutral-dark">{`Format yang didukung: JPG, PNG, PDF (ukuran maksimal 2MB)`}</p>
          </div>
          <button
            type="button"
            className="text-10 md:text-12 lg:text-14 font-bold text-khaffah-primary bg-khaffah-primary/20 px-4 py-2 rounded-xl"
          >
            Pilih File
          </button>
        </div>
      )}
    </Card>
  );
}

/** Wrapper yang integrasi dengan react-hook-form */
export function DropzoneField<T extends FieldValues>({
  name,
  label,
  placeholder = "Tarik & lepaskan file, atau klik untuk pilih",
  accept,
  maxFiles = 1,
}: DropzoneFieldProps<T>) {
  const form = useFormContext<T>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className={fieldState.error ? "border-2 border-destructive rounded-lg" : ""}>
              <DropzoneInput
                value={field.value}
                onChange={field.onChange}
                placeholder={placeholder}
                accept={accept}
                maxFiles={maxFiles}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
