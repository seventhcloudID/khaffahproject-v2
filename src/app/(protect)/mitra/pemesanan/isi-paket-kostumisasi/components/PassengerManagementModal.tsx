"use client";

import { Input } from "@/components/ui/input";
import { ArrowRight, Plus, User } from "lucide-react";
import { useState } from "react";

interface PassengerManagementModalProps {
  passengers: Passenger[];
  savedPassengers: Passenger[];
  onClose: () => void;
  onAddPassenger: (passenger: Passenger) => void;
  onRemovePassenger: (passengerId: string) => void;
}

interface Passenger {
  id: string;
  name: string;
  idNumber: string;
  gender: "male" | "female";
  phoneNumber?: string;
  address?: string;
  city?: string;
}

export default function PassengerManagementModal({
  passengers,
  savedPassengers,
  onClose,
  onAddPassenger,
  onRemovePassenger,
}: PassengerManagementModalProps) {
  const [currentSection, setCurrentSection] = useState<
    "list" | "search" | "create"
  >("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [newPassenger, setNewPassenger] = useState<Omit<Passenger, "id">>({
    name: "",
    idNumber: "",
    gender: "male",
    phoneNumber: "",
    address: "",
    city: "",
  });

  // Filter passenger berdasarkan pencarian
  const filteredPassengers = savedPassengers.filter(
    (passenger) =>
      passenger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      passenger.idNumber.includes(searchQuery)
  );

  // Cek apakah passenger sudah ditambahkan
  const isPassengerAdded = (passengerId: string) => {
    return passengers.some((p) => p.id === passengerId);
  };

  // Handler untuk menambah passenger baru
  const handleAddNewPassenger = () => {
    if (newPassenger.name && newPassenger.idNumber) {
      const passenger: Passenger = {
        ...newPassenger,
        id: Date.now().toString(), // Generate simple ID
      };
      onAddPassenger(passenger);
      setNewPassenger({
        name: "",
        idNumber: "",
        gender: "male",
        phoneNumber: "",
        address: "",
        city: "",
      });
      setCurrentSection("list");
    }
  };

  return (
    <Modal onClose={onClose} title="Kelola Jemaah">
      <div className="h-full flex flex-col">
        {currentSection === "list" && (
          <>
            <div className="flex-1 space-y-4">
              {/* Tombol Tambah Jemaah */}
              <button
                onClick={() => setCurrentSection("search")}
                type="button"
                className="w-full p-4 bg-emerald-50 text-emerald-700 rounded-xl flex justify-center items-center gap-2 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Tambah Jemaah</span>
              </button>

              {/* Daftar Jemaah yang Sudah Dipilih */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-600">
                  Jemaah Terpilih
                </h4>
                {passengers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Belum ada jemaah yang dipilih</p>
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {passengers.map((passenger) => (
                      <div
                        key={passenger.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-white"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <User className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {passenger.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              KTP - {passenger.idNumber}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemovePassenger(passenger.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t">
              <button
                onClick={onClose}
                className="w-full bg-emerald-700 text-white py-3 rounded-lg font-semibold hover:bg-emerald-800 transition-colors"
              >
                Simpan ({passengers.length} Jemaah)
              </button>
            </div>
          </>
        )}

        {currentSection === "search" && (
          <>
            <div className="flex-1 space-y-4">
              {/* Header dengan tombol kembali */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentSection("list")}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
                <h3 className="font-semibold">Pilih Jemaah</h3>
              </div>

              {/* Tombol Tambah Data Baru */}
              <button
                onClick={() => setCurrentSection("create")}
                className="w-full p-4 bg-white border rounded-xl flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <User className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="font-semibold">Tambah Data Jemaah Baru</span>
                </div>
                <Plus className="w-5 h-5 text-emerald-600" />
              </button>

              {/* Pencarian */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  atau, pilih dari daftar jemaah tersimpan
                </p>
                <Input
                  placeholder="Cari Nama Jemaah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Daftar Jemaah Tersimpan */}
              <div className="max-h-80 overflow-y-auto space-y-2">
                {filteredPassengers.map((passenger) => {
                  const isAdded = isPassengerAdded(passenger.id);

                  return (
                    <button
                      key={passenger.id}
                      type="button"
                      onClick={() => {
                        if (!isAdded) {
                          onAddPassenger(passenger);
                        }
                      }}
                      disabled={isAdded}
                      className={`w-full flex items-center justify-between p-3 border rounded-xl text-left transition-colors ${
                        isAdded
                          ? "bg-emerald-50 border-emerald-200 cursor-not-allowed"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isAdded ? "bg-emerald-100" : "bg-gray-100"
                          }`}
                        >
                          <User
                            className={`w-4 h-4 ${
                              isAdded ? "text-emerald-600" : "text-gray-400"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {passenger.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            KTP - {passenger.idNumber}
                          </p>
                        </div>
                      </div>
                      {isAdded ? (
                        <span className="text-xs text-emerald-600 font-medium italic">
                          Terpilih
                        </span>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {currentSection === "create" && (
          <>
            <div className="flex-1 space-y-4">
              {/* Header dengan tombol kembali */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentSection("search")}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
                <h3 className="font-semibold">Tambah Jemaah Baru</h3>
              </div>

              {/* Form Tambah Jemaah */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Nama Lengkap
                  </label>
                  <Input
                    value={newPassenger.name}
                    onChange={(e) =>
                      setNewPassenger((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Nomor KTP
                  </label>
                  <Input
                    value={newPassenger.idNumber}
                    onChange={(e) =>
                      setNewPassenger((prev) => ({
                        ...prev,
                        idNumber: e.target.value,
                      }))
                    }
                    placeholder="Masukkan nomor KTP"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Jenis Kelamin
                  </label>
                  <select
                    value={newPassenger.gender}
                    onChange={(e) =>
                      setNewPassenger((prev) => ({
                        ...prev,
                        gender: e.target.value as "male" | "female",
                      }))
                    }
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Nomor Telepon
                  </label>
                  <Input
                    value={newPassenger.phoneNumber}
                    onChange={(e) =>
                      setNewPassenger((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                    placeholder="Masukkan nomor telepon"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Alamat
                  </label>
                  <Input
                    value={newPassenger.address}
                    onChange={(e) =>
                      setNewPassenger((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Kota</label>
                  <Input
                    value={newPassenger.city}
                    onChange={(e) =>
                      setNewPassenger((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    placeholder="Masukkan kota"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t flex gap-3">
              <button
                onClick={() => setCurrentSection("search")}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAddNewPassenger}
                disabled={!newPassenger.name || !newPassenger.idNumber}
                className="flex-1 bg-emerald-700 text-white py-3 rounded-lg font-semibold hover:bg-emerald-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Tambah Jemaah
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-3xl h-[80vh] bg-white rounded-lg p-0 flex flex-col">
        {/* Header - tidak ikut scroll */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="font-medium text-lg">{title}</div>
          <button onClick={onClose} className="rounded-md border px-3 py-1">
            X
          </button>
        </div>

        {/* Body - area yang di-scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
