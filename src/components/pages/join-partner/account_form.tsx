
import { Header, PasswordField } from "@/components/shared";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MitraRegistration } from "@/typing/mitra-registration";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CarouselApi } from "@/components/ui/carousel";
import { documentById, cn } from "@/lib/utils";
interface Props {
  api: CarouselApi;
}

const AccountForm = (props: Props) => {
  const form = useFormContext<MitraRegistration>();

  const handleScrollNext = async () => {
    // Validate only the fields in this step
    const isValid = await form.trigger(["email", "no_handphone", "password", "confirmPassword"]);
    
    if (!isValid) {
      // Form has errors, don't proceed
      return;
    }

    if (!props.api?.canScrollNext) return;
    props.api.scrollNext();
    documentById<HTMLDivElement>("body").scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="sm:space-y-6">
      <div className="p-4 sm:p-0">
        <Header
          title="Pembuatan Akun"
          description="Isi data berikut untuk pembuatan akun anda, pastikan data terisi dengan benar, dan gunakan password yang gampang kamu ingat."
        />
      </div>
      <Card className="rounded-none md:rounded-2xl">
        <CardHeader>
          <div>
            <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Informasi Akun`}</h1>
            <p className="text-10  md:text-12  lg:text-14">{`Silahkan isi data berikut di bawah ini.`}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Alamat Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className={cn(
                        "bg-khaffah-neutral-light placeholder:text-khaffah-neutral-dark py-6 px-4",
                        fieldState.error && "border-destructive"
                      )}
                      placeholder="Contoh: ahmad.mitra@example.com"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="no_handphone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>No WhatsApp Aktif</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(
                        "bg-khaffah-neutral-light placeholder:text-khaffah-neutral-dark py-6 px-4",
                        fieldState.error && "border-destructive"
                      )}
                      placeholder="Contoh: 081234567890"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PasswordField
              name="password"
              label="Buat Password"
              placeholder="Minimal 8 karakter"
            />
            <PasswordField
              name="confirmPassword"
              label="Verifikasi Ulang Password"
              placeholder="Ketik ulang password yang sudah dibuat"
            />
          </div>
        </CardContent>
        <CardContent>
          <button
            onClick={handleScrollNext}
            className="bg-khaffah-primary py-2 rounded-xl w-full text-white font-bold text-12 md:text-14 lg:text-16"
            type="button"
          >
            Lanjut
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountForm;
