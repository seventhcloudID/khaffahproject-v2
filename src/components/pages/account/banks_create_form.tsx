"use client";

import { useState } from "react";
// import Link from "next/link";
import { Icon } from "@/components/icon";
import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";

// --- Imports ---
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";

// (Opsional) Komponen yang biasa dipakai di form
import {
    Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from "@/components/ui/form";
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { Dialog, 
    DialogTrigger, 
    DialogContent, 
    // DialogHeader, 
    DialogTitle, 
    DialogFooter, 
    // DialogClose 
} from '@/components/ui/dialog';


const BankAccountsCreateForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const fromMitra = searchParams.get("from") === "mitra";

    // State dasar
    const [open, setOpen] = useState(false);

    // Fungsi pembantu
    const onOpenChange = (val: boolean) => setOpen(val);

    // useState Dialog Submit
    const [message, setMessage] = useState("");
    const [section, setSection] = useState<'valid' | 'invalid' | 'error'>('valid');

    const messages = {
        valid: "Berhasil Menambahkan Rekening.",
        invalid: "Gagal Menambahkan Rekening, Cek kembali formulir anda.",
        error: "Something went wrong. Please try again later.",
    };
    
    // Dialog Submit Handler
    const handleSubmit = async () => {
        setOpen(true);

        try {
            const isValid = await form.trigger();
            if (!isValid) {
                setSection('invalid');
                setMessage(messages.invalid);
                return;
            }

            const values = form.getValues();
            const accountNumber = values.BankAccountNumber.replace(/\D/g, "");
            const payload = {
                bank_name: values.selectBankName,
                account_number: accountNumber,
                account_holder_name: values.BankAccountName,
            };

            const res = await fetch("/api/account/banks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include",
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setSection('error');
                setMessage(data?.message ?? messages.error);
                return;
            }

            setSection('valid');
            setMessage(messages.valid);
            form.reset();
            setTimeout(() => {
                setOpen(false);
                router.push(fromMitra ? "/mitra/rekening-kamu" : "/account/bank");
            }, 1500);
        } catch (e) {
            setSection('error');
            const msg = e instanceof Error ? `❌ ${e.message}` : messages.error;
            setMessage(msg);
        }
    };

    const BANK_OPTIONS = [
        "BCA",
        "BRI",
        "BNI",
        "Mandiri",
        "CIMB Niaga",
        "Permata",
        "Danamon",
        "BTN",
        "Maybank",
        "OCBC NISP",
        "Mega",
        "Sinarmas",
    ] as const;

    const BankNameEnum = z.enum([...BANK_OPTIONS, ""]);
    const normalizeDigits = (v: string) => v.replace(/\D+/g, "");

    // --- Schema (multi field) ---
    const formSchema = z.object({
        BankAccountNumber: z
            .string()
            .min(1, { message: "Wajib diisi" })
            .trim()
            .refine((v) => /^[\d\s\-]+$/.test(v), {
                message: "Format tidak valid, hanya angka yang diperbolehkan"
            })
            .transform((v) => normalizeDigits(v))
            .refine((v) => v.length > 0, {
                message: "Format nomor rekening tidak valid"
            })
            .refine((v) => /^\d+$/.test(v), { message: "Harus berupa angka" })
            .refine((v) => v.length >= 6, { message: "Nomor rekening minimal 6 karakter" })
            .refine((v) => v.length <= 20, { message: "Maksimal 20 karakter" }),
        BankAccountName: z
            .string({ message: "Wajib diisi" })
            .min(1, { message: "Wajib diisi" })
            .trim()
            .max(60, { message: "Maksimal 60 karakter" })
            .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ'`. ]*$/u, {
                message: "Hanya huruf, spasi, titik atau apostrof",
            }),
        selectBankName: BankNameEnum.refine(
            (val) => val !== "",
            { message: "Harus memilih bank yang valid" }
        ),
    });

    type FormValues = z.infer<typeof formSchema>;

    // --- useForm ---
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            BankAccountNumber: "",
            BankAccountName: "",
            selectBankName: "",
        },
    });
    // --- onSubmit ---
    const onSubmit = (values: FormValues) => console.log(values);

    return (
        <>
            <Card>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => router.push(fromMitra ? "/mitra/rekening-kamu" : "/account/bank", { scroll: true })}
                            className="flex items-center gap-2 text-khaffah-primary hover:cursor-pointer"
                        >
                            <Icon name="ArrowRight" className="rotate-180 fill-khaffah-primary" />
                            <span className="text-12 md:text-14 lg:text-16 font-semibold hover:underline">Kembali</span>
                        </button>
                        <div className="text-right">
                            <h2 className="text-12 md:text-14 lg:text-16 font-bold">Isi Data Rekening</h2>
                            <p className="text-10 md:text-12 lg:text-14 text-muted-foreground">Isi formulir untuk menambahkan data rekening bank mitra ke akun.</p>
                        </div>
                    </div>
                </CardContent>
                <CardContent>
                    <hr />
                </CardContent>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="selectBankName"
                                render={({ field }) => (
                                    <FormItem >
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl className="h-12">
                                                <SelectTrigger className="w-full py-6">
                                                    <SelectValue placeholder="Pilih Bank" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {BANK_OPTIONS.map((bank) => (
                                                    <SelectItem key={bank} className="py-4" value={bank}>
                                                        {bank}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="BankAccountNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nomor Rekening</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-khaffah-neutral-light placeholder:text-khaffah-neutral-dark py-6 px-4"
                                                placeholder="Masukan Nomor Rekening Anda..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="BankAccountName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Rekening</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-khaffah-neutral-light placeholder:text-khaffah-neutral-dark py-6 px-4"
                                                placeholder="Masukan A.N Rekening ..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center gap-2">
                                <Icon name="Info" className="fill-khaffah-neutral-mid w-3 h-3" />
                                <span className="text-10 md:text-12 lg:text-14 text-muted-foreground">Dengan melanjutkan, Anda menyetujui <a className="text-khaffah-secondary underline hover:cursor-pointer" href="#">Syarat Layanan</a> dan <a className="text-khaffah-secondary underline hover:cursor-pointer" href="#">Kebijakan Privasi</a> kami untuk menambahkan rekening.</span>
                            </div>


                            <Dialog open={open} onOpenChange={onOpenChange}>
                                <DialogTrigger asChild>
                                    <button
                                        type="button"
                                        className="bg-khaffah-primary text-white w-full p-2 rounded-md text-12 md:text-14 lg:text-16"
                                        onClick={() => handleSubmit()}
                                    >
                                        Submit
                                    </button>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-md md:max-w-lg">
                                    {section === "valid" && (
                                        <>
                                            <DialogTitle>
                                              <VisuallyHidden>Success</VisuallyHidden>
                                            </DialogTitle>
                                            <div className="flex flex-col items-center space-y-4">
                                              <div
                                                className="w-full h-40 bg-no-repeat bg-center bg-contain mb-2"
                                                style={{ backgroundImage: "url('/Success.svg')", backgroundSize: 'contain' }}
                                                role="img"
                                                aria-label="Success icon description"
                                              />
                                              <h1 className="text-16 md:text-18 lg:text-20 font-bold text-center">{message}</h1>
                                            </div>
                                            <DialogFooter className="mt-6 flex flex-col items-center">
                                              <VisuallyHidden>Success</VisuallyHidden>
                                            </DialogFooter>
                                        </>
                                    )}

                                    {section === "invalid" && (
                                        <>
                                            <DialogTitle>
                                                <VisuallyHidden>Invalid</VisuallyHidden>
                                            </DialogTitle>

                                            <div className="flex flex-col items-center pace-y-4">
                                                <div
                                                  className="w-full h-40 bg-no-repeat mb-4 bg-center bg-contain"
                                                  style={{ backgroundImage: "url('/Failure.svg')",backgroundSize:"contain" }}
                                                  role="img"
                                                  aria-label="icon description"
                                                />
                                                <h1 className="text-16 md:text-18 lg:text-20 font-bold text-center">{message}</h1>
                                            </div>

                                            <DialogFooter>
                                                <hr/>
                                            </DialogFooter>
                                        </>
                                    )}

                                    {section === "error" && (
                                        <>
                                            <DialogTitle>
                                                <VisuallyHidden>Error</VisuallyHidden>
                                            </DialogTitle>
                                            <div className="flex flex-col items-center pace-y-4">
                                                <div
                                                  className="w-full h-40 bg-no-repeat mb-4 bg-center bg-contain"
                                                  style={{ backgroundImage: "url('/Failure.svg')", backgroundSize: "contain" }}
                                                  role="img"
                                                  aria-label="icon description"
                                                />
                                                <h1 className="text-16 md:text-18 lg:text-20 font-bold text-center">{message}</h1>
                                            </div>
                                            <DialogFooter>
                                                <hr/>
                                            </DialogFooter>
                                        </>
                                    )}
                                    
                                </DialogContent>
                            </Dialog>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <hr className="my-4" />
        </>
    );
};

export default BankAccountsCreateForm;