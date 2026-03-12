import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Clock, Mail, MapPin, PhoneIcon } from "lucide-react";

export default function KontakMitraContent() {
  return (
    <div className="w-full flex flex-col mt-4 ">
      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <div className="bg-khaffah-secondary/20  rounded-xl mb-4 p-2 w-fit">
            <MapPin className="w-5 h-5 text-khaffah-secondary" />
          </div>
          <p className="text-slate-600 text-sm">Alamat Kantor Kami</p>
          <p className="text-slate-900 mt-1">18 Office Tower, JKT, IDN</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <div className="bg-khaffah-secondary/20  rounded-xl mb-4 p-2 w-fit">
            <Mail className="w-5 h-5 text-khaffah-secondary" />
          </div>
          <p className="text-slate-600 text-sm">Email Resmi Kaffah Tour</p>
          <p className="text-slate-900 mt-1">safarkhadamat@gmail.com</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <div className="bg-khaffah-secondary/20  rounded-xl mb-4 p-2 w-fit">
            <PhoneIcon className="w-5 h-5 text-khaffah-secondary" />
          </div>
          <p className="text-slate-600 text-sm">Hubungi Kami via WhatsApp</p>
          <p className="text-slate-900 mt-1">+62 896 7777 1070</p>
          <p className="text-slate-500 text-xs mt-1">
            Tersedia untuk panggilan dan pesan cepat selama jam kerja.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <div className="bg-khaffah-secondary/20  rounded-xl mb-4 p-2 w-fit">
            <Clock className="w-5 h-5 text-khaffah-secondary" />
          </div>
          <p className="text-slate-600 text-sm">Jam Layanan Customer Support</p>
          <p className="text-slate-900 mt-1 font-medium">09.00 - 17.00 WIB</p>
          <p className="text-slate-500 text-xs mt-1">
            Di luar jam tersebut layanan tetap dipantau untuk kondisi darurat.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-700 text-sm">Nama Anda</label>
            <Input
              className="w-full  border border-transparent bg-muted px-4 py-2 text-sm outline-none focus:border-khaffah-primary focus:ring-2 focus:ring-khaffah-primary/30"
              placeholder="Contoh: Ahmad Hidayat"
              required
            />
          </div>

          <div>
            <label className="text-slate-700 text-sm">No WhatsApp</label>
            <Input
              className="w-full mt-1  border border-transparent bg-muted px-4 py-2 text-sm outline-none focus:border-khaffah-primary focus:ring-2 focus:ring-khaffah-primary/30"
              placeholder="Contoh: 0812xxxxxxx"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-slate-700 text-sm">Email Anda</label>
          <Input
            placeholder="Contoh: namaanda@email.com"
            className="w-full mt-1  border border-transparent bg-muted px-4 py-2 text-sm outline-none focus:border-khaffah-primary focus:ring-2 focus:ring-khaffah-primary/30"
          />
        </div>

        <div className="mt-4">
          <label className="text-slate-700 text-sm">Pesan</label>
          <Textarea
            placeholder="Tulis pesan Anda di sini..."
            className="w-full mt-1  border border-transparent bg-muted px-4 py-2 text-sm outline-none focus:border-khaffah-primary focus:ring-2 focus:ring-khaffah-primary/30 h-32"
          />
        </div>

        <Button className="w-full mt-6 bg-khaffah-primary hover:bg-khaffah-primary/90 text-white h-12 rounded-full">
          Kirim Pesan
        </Button>
      </div>
    </div>
  );
}
