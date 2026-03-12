// app/profile/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMe } from "@/query/auth";
import { useQueryClient } from "@tanstack/react-query";

// ✅ Schema validasi pakai zod
const profileSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "Birth date is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const MAX_FILE_SIZE = 1024 * 1024; // 1 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export default function ProfileForm() {
  const { data, isLoading } = useMe();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      gender: "male",
      birthDate: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setSaving(true);
    try {
      const body = {
        nama_lengkap: data.fullName,
        jenis_kelamin: data.gender === "male" ? "laki-laki" : "perempuan",
        tgl_lahir: data.birthDate || null,
        email: data.email,
        no_handphone: data.phone,
      };
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          result?.message ||
          result?.errors?.nama_lengkap?.[0] ||
          result?.errors?.email?.[0] ||
          result?.errors?.no_handphone?.[0] ||
          "Gagal memperbarui profil";
        toast.error(msg);
        return;
      }
      toast.success(result?.message || "Profil berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["ME"] });
    } catch {
      toast.error("Gagal memperbarui profil. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const photoUrl = data?.foto_profile ?? previewUrl;

  useEffect(() => {
    if (!data) return;
    form.reset({
      fullName: data?.nama_lengkap ?? "",
      email: data?.email ?? "",
      phone: data?.no_handphone ?? "",
      birthDate: data?.tgl_lahir ?? "",
      gender: data?.jenis_kelamin === "perempuan" ? "female" : "male",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Format hanya .JPEG, .JPG, atau .PNG");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Ukuran maksimal 1 MB");
      return;
    }

    setPhotoUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("foto_profile", file);

      const res = await fetch("/api/account/profile/photo", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(result?.message || result?.errors?.foto_profile?.[0] || "Upload gagal");
        setPreviewUrl(null);
        return;
      }

      toast.success("Foto profile berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["ME"] });
      setPreviewUrl(null);
    } catch {
      toast.error("Upload gagal. Coba lagi.");
      setPreviewUrl(null);
    } finally {
      setPhotoUploading(false);
      e.target.value = "";
    }
  };

  if (isLoading) {
    return (
      <Card className="md:px-4 lg:px-6 rounded-none md:rounded-2xl">
        <CardContent className="pt-6">
          <div className="h-5 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-full max-w-xl bg-muted animate-pulse rounded" />
        </CardContent>
        <CardContent><hr /></CardContent>
        <div className="flex flex-col md:flex-row gap-8">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="size-44 md:w-28 md:h-28 rounded-full bg-muted animate-pulse shrink-0" />
              <div className="h-9 w-24 bg-muted animate-pulse rounded" />
              <div className="h-9 w-32 bg-muted animate-pulse rounded" />
            </div>
          </CardContent>
          <CardContent className="flex-1 space-y-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
            ))}
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="md:px-4 lg:px-6 rounded-none md:rounded-2xl">
      {/* Form */}
      <CardContent>
        <div>
          <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Profil Kamu`}</h1>
          <p className="text-10  md:text-12  lg:text-14">{`Kelola informasi pribadi kamu di sini. Pastikan data selalu akurat untuk memudahkan proses pemesanan dan konfirmasi layanan.`}</p>
        </div>
      </CardContent>
      <CardContent>
        <hr />
      </CardContent>
      <div className="flex flex-col md:flex-row gap-8">
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="size-44 md:w-28 md:h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm overflow-hidden shrink-0">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt="Foto profil"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                  unoptimized={photoUrl.startsWith("blob:")}
                />
              ) : (
                "IMG"
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/jpg,image/png"
              className="hidden"
              onChange={handlePhotoChange}
              disabled={photoUploading}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={photoUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {photoUploading ? "Mengunggah..." : "Pilih Foto"}
            </Button>
            <p className="text-xs text-gray-400 text-center">
              Max size: 1 MB <br /> Format: .JPEG, .PNG
            </p>
            {/* TODO: halaman ganti password belum tersedia */}
            <Button variant="outline" size="sm" type="button" disabled title="Fitur ganti password akan segera tersedia">
              Ganti Password
            </Button>
          </div>
        </CardContent>
        <CardContent className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="grid ">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex gap-6"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="male" id="male" />
                          <label htmlFor="male">Male</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="female" id="female" />
                          <label htmlFor="female">Female</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birth Date */}
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="mt-4" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </div>
    </Card>
  );
}
