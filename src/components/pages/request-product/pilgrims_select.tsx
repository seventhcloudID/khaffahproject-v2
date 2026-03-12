"use client";

import { useCallback, useState } from "react";
import { FieldValues, Path, useFormContext, useWatch } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Icon } from "@/components/icon";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useGetJamaahList } from "@/query/jamaah";
import { useMe } from "@/query/auth";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormLabel } from "@/components/ui/form";

interface Props<T extends FieldValues> {
  name: Path<T>;
}

type Section = "list" | "create";

type PilgrimItem = {
  _id?: string;
  id?: string;
  fullName: string;
  nama?: string;
  nik?: string;
  no_paspor?: string;
  tanggal_lahir?: Date;
  gender?: "male" | "female";
  state?: string;
  city?: string;
  suburb?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  dokumen_ktp_id?: number | null;
  dokumen_paspor_id?: number | null;
};

const emptyPilgrim = (): PilgrimItem => ({
  _id: `new-${Date.now()}`,
  id: `new-${Date.now()}`,
  fullName: "",
  nama: "",
  nik: "",
  no_paspor: "",
  gender: "male",
  state: "-",
  city: "-",
  suburb: "-",
  address: "-",
});

function isUserAdded(list: PilgrimItem[] | undefined, userId: string): boolean {
  if (!Array.isArray(list) || list.length === 0) return false;
  return list.some(
    (item) => item._id === userId || item.id === userId || String(item._id) === userId
  );
}

export default function PilgrimsSelect<T extends FieldValues>(props: Props<T>) {
  const form = useFormContext<T>();
  const watch = useWatch({ control: form.control, name: props.name });
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section>("list");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formPilgrim, setFormPilgrim] = useState<PilgrimItem>(emptyPilgrim());

  const { data: userData, isLoading: isUserLoading } = useMe();
  const { data: jamaahResponse, isLoading: isJamaahLoading } = useGetJamaahList({
    enabled: !isUserLoading && !!userData,
  });
  // Backend return { data: [...] }; normalisasi ke array
  const rawList = Array.isArray(jamaahResponse)
    ? jamaahResponse
    : (jamaahResponse as { data?: unknown[] })?.data ?? [];
  const savedJamaah: PilgrimItem[] = Array.isArray(rawList)
    ? (rawList as { id?: string; nama_lengkap?: string; nomor_identitas?: string; nomor_passpor?: string; dokumen_ktp_id?: number | null; dokumen_paspor_id?: number | null }[]).map(
        (j) => ({
          _id: String(j.id ?? ""),
          id: String(j.id ?? ""),
          fullName: j.nama_lengkap ?? "",
          nama: j.nama_lengkap ?? "",
          nik: j.nomor_identitas ?? "",
          no_paspor: j.nomor_passpor ?? "",
          gender: "male" as const,
          state: "-",
          city: "-",
          suburb: "-",
          address: "-",
          dokumen_ktp_id: j.dokumen_ktp_id ?? null,
          dokumen_paspor_id: j.dokumen_paspor_id ?? null,
        })
      )
    : [];

  const closeModal = useCallback(() => {
    setOpen(false);
    setSection("list");
    setEditingIndex(null);
    setFormPilgrim(emptyPilgrim());
  }, []);

  const onOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSection("list");
      setEditingIndex(null);
      setFormPilgrim(emptyPilgrim());
    }
  }, []);

  const currentList: PilgrimItem[] = Array.isArray(watch) ? watch : [];

  const handleAddPilgrim = (p: PilgrimItem) => {
    const current = Array.isArray(watch) ? watch : [];
    const toAdd = {
      ...p,
      _id: p._id ?? `p-${Date.now()}`,
      id: p.id ?? p._id ?? `p-${Date.now()}`,
      nama: p.fullName || p.nama,
    };
    form.setValue(props.name, [...current, toAdd] as never);
  };

  const handleSaveNewPilgrim = () => {
    const nama = formPilgrim.fullName?.trim() || formPilgrim.nama?.trim();
    if (!nama) return;
    const toAdd: PilgrimItem = {
      ...formPilgrim,
      fullName: nama,
      nama,
      _id: `new-${Date.now()}`,
      id: `new-${Date.now()}`,
    };
    handleAddPilgrim(toAdd);
    setFormPilgrim(emptyPilgrim());
    setSection("list");
  };

  const handleEditPilgrim = (index: number) => {
    const item = currentList[index];
    if (item) {
      setFormPilgrim({
        ...item,
        _id: item._id ?? item.id,
        id: item.id ?? item._id,
      });
      setEditingIndex(index);
      setSection("create");
    }
  };

  const handleUpdatePilgrim = () => {
    if (editingIndex === null) return;
    const nama = formPilgrim.fullName?.trim() || formPilgrim.nama?.trim();
    if (!nama) return;
    const updated = [...currentList];
    updated[editingIndex] = {
      ...formPilgrim,
      fullName: nama,
      nama,
    };
    form.setValue(props.name, updated as never);
    setEditingIndex(null);
    setFormPilgrim(emptyPilgrim());
    setSection("list");
  };

  const handleRemovePilgrim = (index: number) => {
    const updated = currentList.filter((_, i) => i !== index);
    form.setValue(props.name, updated as never);
  };

  return (
    <FormField
      control={form.control}
      name={props.name}
      render={
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- FormField passes field; custom dialog controls value
        ({ field: _field }) => (
        <FormItem>
          <FormControl>
            <div className="flex items-center gap-2">
              <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="py-6 pr-2 pl-4 w-full flex justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <Icon name="Users" className="fill-khaffah-neutral-mid" />
                      <p className="text-10 md:text-12 lg:text-14">
                        Kelola Jumlah Jemaah
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-10 md:text-12 lg:text-14">
                        <span className="font-bold">{currentList.length}</span> Jemaah
                      </p>
                      <div className="bg-khaffah-primary/20 p-2 w-fit rounded-md">
                        <Icon name="Pen" className="fill-khaffah-primary" />
                      </div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent
                  showCloseButton={false}
                  className="sm:max-w-md md:max-w-xl lg:max-w-4xl"
                >
                  {section === "list" && (
                    <>
                      <DialogHeader>
                        <DialogTitle className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={closeModal}
                              className="lg:bg-gray-100 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 flex justify-center items-center rounded-md"
                            >
                              <Icon
                                name="ArrowRight"
                                className="rotate-180 fill-black"
                              />
                            </button>
                            <p className="text-12 md:text-14 lg:text-16">
                              Daftar Jemaah
                            </p>
                          </div>
                          <DialogClose className="hidden" />
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <ScrollArea className="h-72 w-full">
                          <div className="space-y-2 w-full">
                            {currentList.length > 0 ? (
                              currentList.map((item: PilgrimItem, idx: number) => (
                                <div
                                  key={item._id ?? item.id ?? idx}
                                  className="flex items-center justify-between border rounded-xl px-4 py-3"
                                >
                                  <div className="flex items-center gap-4">
                                    <Icon
                                      name="User"
                                      className="fill-khaffah-neutral-mid"
                                    />
                                    <div>
                                      <p className="text-10 md:text-12 lg:text-14 font-medium">
                                        {item.fullName || item.nama || "-"}
                                      </p>
                                      <p className="text-8 md:text-10 lg:text-12 text-khaffah-neutral-dark">
                                        {item.nik ? `NIK: ${item.nik}` : item.no_paspor ? `Paspor: ${item.no_paspor}` : "—"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleEditPilgrim(idx)}
                                      className="p-1.5 hover:bg-gray-100 rounded"
                                      title="Edit"
                                    >
                                      <Icon
                                        name="Pen"
                                        className="fill-khaffah-secondary"
                                      />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemovePilgrim(idx)}
                                      className="p-1.5 hover:bg-red-50 rounded text-red-500"
                                      title="Hapus"
                                    >
                                      <Icon name="Trash" className="fill-red-500" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-12 text-khaffah-neutral-dark py-4 text-center">
                                Belum ada jemaah. Pilih dari daftar jemaah terdaftar di bawah.
                              </p>
                            )}
                          </div>
                        </ScrollArea>
                        {savedJamaah.length > 0 && (
                          <>
                            <p className="text-10 md:text-12 lg:text-14 font-medium text-khaffah-neutral-dark">
                              Jemaah yang sudah terdaftar di akun Anda
                            </p>
                            <ScrollArea className="h-40 w-full">
                              <div className="space-y-2">
                                {savedJamaah.map((item) => {
                                  const added = isUserAdded(currentList, item._id ?? item.id ?? "");
                                  return (
                                    <button
                                      key={item._id ?? item.id}
                                      type="button"
                                      onClick={() => {
                                        if (added) return;
                                        handleAddPilgrim(item);
                                      }}
                                      disabled={added}
                                      className={cn(
                                        "w-full flex justify-between items-center border rounded-xl h-12 px-4 text-left",
                                        added && "opacity-50 cursor-not-allowed"
                                      )}
                                    >
                                      <div className="flex items-center gap-3">
                                        <Icon name="User" className="fill-khaffah-neutral-mid" />
                                        <div>
                                          <p className="text-12 font-medium">{item.fullName || item.nama}</p>
                                          <p className="text-10 text-gray-500">
                                            {item.nik ? `NIK: ${item.nik}` : ""}
                                          </p>
                                        </div>
                                      </div>
                                      {added ? (
                                        <span className="text-10 text-gray-500 italic">Terpilih</span>
                                      ) : (
                                        <Icon name="Plus" className="fill-khaffah-primary" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </ScrollArea>
                          </>
                        )}
                        {!isJamaahLoading && savedJamaah.length === 0 && (
                          <p className="text-12 text-khaffah-neutral-dark">
                            Belum ada jemaah terdaftar di akun. Tambah data jemaah di menu Akun → Daftar Jemaah terlebih dahulu.
                          </p>
                        )}
                        {isJamaahLoading && (
                          <p className="text-12 text-gray-500">Memuat daftar jemaah...</p>
                        )}
                      </div>
                      <DialogFooter>
                        <button
                          onClick={() => setOpen(false)}
                          className="bg-khaffah-primary text-white w-full p-2 rounded-md text-12 md:text-14 lg:text-16"
                        >
                          Simpan
                        </button>
                      </DialogFooter>
                    </>
                  )}

                  {section === "create" && (
                    <>
                      <DialogHeader>
                        <DialogTitle className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setSection("list");
                                setFormPilgrim(emptyPilgrim());
                                setEditingIndex(null);
                              }}
                              className="lg:bg-gray-100 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 flex justify-center items-center rounded-md"
                            >
                              <Icon
                                name="ArrowRight"
                                className="rotate-180 fill-black"
                              />
                            </button>
                            <p className="text-12 md:text-14 lg:text-16">
                              Edit Jemaah
                            </p>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <FormLabel>Jenis Kelamin</FormLabel>
                          <RadioGroup
                            value={formPilgrim.gender ?? "male"}
                            onValueChange={(v) =>
                              setFormPilgrim((p) => ({ ...p, gender: v as "male" | "female" }))
                            }
                            className="flex gap-4 mt-2"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="male" id="male" />
                              <FormLabel htmlFor="male" className="font-normal">Bapak</FormLabel>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="female" id="female" />
                              <FormLabel htmlFor="female" className="font-normal">Ibu</FormLabel>
                            </div>
                          </RadioGroup>
                        </div>
                        <div>
                          <FormLabel>Nama Lengkap *</FormLabel>
                          <Input
                            value={formPilgrim.fullName || formPilgrim.nama || ""}
                            onChange={(e) =>
                              setFormPilgrim((p) => ({
                                ...p,
                                fullName: e.target.value,
                                nama: e.target.value,
                              }))
                            }
                            placeholder="Nama lengkap sesuai KTP"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <FormLabel>NIK</FormLabel>
                          <Input
                            value={formPilgrim.nik ?? ""}
                            onChange={(e) =>
                              setFormPilgrim((p) => ({ ...p, nik: e.target.value }))
                            }
                            placeholder="16 digit NIK"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <FormLabel>No. Paspor</FormLabel>
                          <Input
                            value={formPilgrim.no_paspor ?? ""}
                            onChange={(e) =>
                              setFormPilgrim((p) => ({ ...p, no_paspor: e.target.value }))
                            }
                            placeholder="Opsional"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <FormLabel>Tanggal Lahir</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal mt-1"
                              >
                                <CalendarDays className="mr-2 h-4 w-4" />
                                {formPilgrim.tanggal_lahir
                                  ? format(formPilgrim.tanggal_lahir, "dd/MM/yyyy")
                                  : "Pilih tanggal"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={
                                  formPilgrim.tanggal_lahir
                                    ? new Date(formPilgrim.tanggal_lahir)
                                    : undefined
                                }
                                onSelect={(d) =>
                                  setFormPilgrim((p) => ({ ...p, tanggal_lahir: d ?? undefined }))
                                }
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <DialogFooter>
                        <button
                          onClick={
                            editingIndex !== null ? handleUpdatePilgrim : handleSaveNewPilgrim
                          }
                          className="bg-khaffah-primary text-white w-full p-2 rounded-md text-12 md:text-14 lg:text-16"
                        >
                          {editingIndex !== null ? "Simpan Perubahan" : "Tambah Jemaah"}
                        </button>
                      </DialogFooter>
                    </>
                  )}
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
