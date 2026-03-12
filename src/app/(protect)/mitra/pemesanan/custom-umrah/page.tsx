import ContextForm from "@/components/pages/request-product/context_form";

/**
 * Form custom umrah untuk mitra — sama dengan /product-request/custom-umrah
 * tapi tetap di dalam layout /mitra/ (sidebar & auth mitra).
 * isMitraContext: data pemesan (nama, no HP, email) diisi otomatis dari akun login, tidak perlu isi manual.
 * Query ?kategori=group|plus-liburan|private dibaca oleh ContextForm.
 */
export default function MitraPemesananCustomUmrahPage() {
  return <ContextForm isMitraContext />;
}
