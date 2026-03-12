"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  Info,
  ShieldCheck,
  Mail,
  RefreshCcw,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { SuccessModal } from "@/components/pages/mitra/ui/SuccessModal";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  type Step = 1 | 2 | 3;
  const [step, setStep] = useState<Step>(1);

  const userEmail = "ahmadhi@gmail.com";

  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const [otp, setOtp] = useState<string>("");
  const [verifying, setVerifying] = useState(false);
  const [resendLeft, setResendLeft] = useState(0);

  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [saving, setSaving] = useState(false);

  const [done, setDone] = useState(false);

  const otpInputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const pwdScore = useMemo(() => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[a-z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return Math.min(s, 4);
  }, [pwd]);

  const canSend = !sending;
  const canVerify = otp.length === 6 && !verifying;
  const canSave = pwdScore >= 3 && pwd === pwd2 && !saving;

  useEffect(() => {
    if (resendLeft <= 0) return;
    const id = setInterval(
      () => setResendLeft((s) => Math.max(0, s - 1)),
      1000
    );
    return () => clearInterval(id);
  }, [resendLeft]);

  async function apiSendOtp(): Promise<{ ok: boolean; to: string }> {
    await new Promise((r) => setTimeout(r, 700));
    return { ok: true, to: userEmail };
  }
  async function apiVerifyOtp(code: string): Promise<{ ok: boolean }> {
    await new Promise((r) => setTimeout(r, 700));
    return { ok: code.length === 6 };
  }
  async function apiChangePassword(newPwd: string): Promise<{ ok: boolean }> {
    await new Promise((r) => setTimeout(r, 800));
    return { ok: newPwd.length >= 8 };
  }

  async function handleSend() {
    if (!canSend) return;
    setSending(true);
    const res = await apiSendOtp();
    setSending(false);
    if (res.ok) {
      setSentTo(res.to);
      setResendLeft(60);
      setStep(2);
      setTimeout(() => otpInputsRef.current[0]?.focus(), 0);
    }
  }

  async function handleVerify() {
    if (!canVerify) return;
    setVerifying(true);
    const res = await apiVerifyOtp(otp);
    setVerifying(false);
    if (res.ok) {
      setStep(3);
      setTimeout(
        () => (document.getElementById("pwd-1") as HTMLInputElement)?.focus(),
        0
      );
    }
  }

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    const res = await apiChangePassword(pwd);
    setSaving(false);
    if (res.ok) {
      setDone(true);
      setOtp("");
      setPwd("");
      setPwd2("");
      setStep(1);

      setTimeout(() => {
        router.push("/mitra/edit-profile");
      }, 3000);
    }
  }

  return (
    <div className="space-y-4">
      {/* Topbar */}
      <div className="flex items-center justify-between">
        <Link
          href="/mitra/edit-profile"
          className="inline-flex items-center gap-1 text-sm text-khaffah-primary hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali
        </Link>
        <div className="text-right">
          <h1 className="text-base font-semibold">Password</h1>
          <p className="text-[12px] text-muted-foreground">
            Lindungi akunmu dengan mengganti password secara berkala.
          </p>
        </div>
      </div>

      {/* Stepper */}
      <Stepper step={step as 1 | 2 | 3} />

      {/* Alert info */}
      <div className="rounded-2xl border border-border bg-khaffah-warning/15 px-4 py-3">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-khaffah-warning" />
          <div className="text-sm">
            <p className="font-medium">Langkah {step} dari 3</p>
            <p className="text-muted-foreground">
              Demi keamanan, kami akan mengirimkan kode OTP ke email terdaftar
              sebelum kamu dapat mengubah password.
            </p>
          </div>
        </div>
      </div>

      {/* CARD */}
      <div className="rounded-xl border border-border bg-card p-4">
        {step === 1 && (
          <StepSend email={userEmail} sending={sending} onSend={handleSend} />
        )}

        {step === 2 && (
          <StepVerify
            email={sentTo ?? userEmail}
            otp={otp}
            setOtp={setOtp}
            onVerify={handleVerify}
            verifying={verifying}
            resendLeft={resendLeft}
            onResend={() => resendLeft === 0 && handleSend()}
            inputsRef={otpInputsRef}
          />
        )}

        {step === 3 && (
          <StepSetPassword
            pwd={pwd}
            setPwd={setPwd}
            pwd2={pwd2}
            setPwd2={setPwd2}
            show1={show1}
            setShow1={setShow1}
            show2={show2}
            setShow2={setShow2}
            pwdScore={pwdScore}
          />
        )}

        {/* CTA di dalam card — DESKTOP ONLY */}
        <div className="mt-4 hidden lg:block">
          {step === 1 && (
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                canSend
                  ? "bg-khaffah-primary hover:brightness-95"
                  : "bg-khaffah-primary/40 cursor-not-allowed"
              }`}
            >
              {sending ? "Mengirim Kode..." : "Kirim Kode"}
            </button>
          )}

          {step === 2 && (
            <button
              onClick={handleVerify}
              disabled={!canVerify}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                canVerify
                  ? "bg-khaffah-primary hover:brightness-95"
                  : "bg-khaffah-primary/40 cursor-not-allowed"
              }`}
            >
              {verifying ? "Memverifikasi..." : "Verifikasi"}
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                canSave
                  ? "bg-khaffah-primary hover:brightness-95"
                  : "bg-khaffah-primary/40 cursor-not-allowed"
              }`}
            >
              {saving ? "Menyimpan..." : "Atur Ulang Kata Sandi"}
            </button>
          )}
        </div>
      </div>

      {/* Spacer untuk sticky bar — hanya MOBILE/TABLET */}
      <div className="h-14 lg:hidden" />

      {/* Sticky CTA — hanya MOBILE/TABLET */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-background/85 backdrop-blur lg:hidden">
        <div className="mx-auto max-w-7xl px-4 py-2">
          {step === 1 && (
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={`w-full rounded-lg px-4 py-2 text-sm font-medium text-white ${
                canSend
                  ? "bg-khaffah-primary hover:brightness-95"
                  : "bg-khaffah-primary/40 cursor-not-allowed"
              }`}
            >
              {sending ? "Mengirim Kode..." : "Kirim Kode"}
            </button>
          )}

          {step === 2 && (
            <button
              onClick={handleVerify}
              disabled={!canVerify}
              className={`w-full rounded-lg px-4 py-2 text-sm font-medium text-white ${
                canVerify
                  ? "bg-khaffah-primary hover:brightness-95"
                  : "bg-khaffah-primary/40 cursor-not-allowed"
              }`}
            >
              {verifying ? "Memverifikasi..." : "Verifikasi"}
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`w-full rounded-lg px-4 py-2 text-sm font-medium text-white ${
                canSave
                  ? "bg-khaffah-primary hover:brightness-95"
                  : "bg-khaffah-primary/40 cursor-not-allowed"
              }`}
            >
              {saving ? "Menyimpan..." : "Atur Ulang Kata Sandi"}
            </button>
          )}
        </div>
      </div>

      {/* Modal sukses */}
      <SuccessModal
        open={done}
        onClose={() => setDone(false)}
        title="Password Berhasil Diubah"
        description="Silakan gunakan kata sandi baru untuk masuk."
      />
    </div>
  );
}

/* =========================================================
   SUB COMPONENTS
========================================================= */

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const items = [
    { id: 1, label: "Kirim Kode" },
    { id: 2, label: "Verifikasi" },
    { id: 3, label: "Password Baru" },
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map((it, idx) => {
        const active = step === it.id;
        const done = step > it.id;
        return (
          <div key={it.id} className="flex items-center gap-3">
            <div
              className={[
                "grid h-8 w-8 place-content-center rounded-full border text-[12px] font-semibold",
                done
                  ? "bg-khaffah-primary text-white border-khaffah-primary"
                  : active
                  ? "border-khaffah-primary text-khaffah-primary"
                  : "border-border text-khaffah-neutral-dark",
              ].join(" ")}
            >
              {done ? <CheckCircle2 className="h-5 w-5" /> : it.id}
            </div>
            <span
              className={[
                "text-[12px] font-medium",
                active ? "text-foreground" : "text-khaffah-neutral-dark",
              ].join(" ")}
            >
              {it.label}
            </span>
            {idx < items.length - 1 && <div className="h-px w-8 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}

function StepSend({
  email,
}: {
  email: string;
  sending: boolean;
  onSend: () => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Kami akan mengirimkan <b>kode OTP</b> ke email terdaftar berikut:
      </p>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-sm">
        <Mail className="h-4 w-4 text-khaffah-primary" />
        <span className="font-medium">{email}</span>
      </div>
      <p className="text-[12px] text-khaffah-neutral-dark">
        Pastikan kamu dapat mengakses email tersebut. Kode OTP berlaku 5 menit.
      </p>

      <div className="rounded-lg border border-border bg-card p-3">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-khaffah-primary" />
          <div className="text-[13px] text-muted-foreground">
            Gunakan password yang kuat dan tidak digunakan pada layanan lain.
          </div>
        </div>
      </div>
    </div>
  );
}

function StepVerify({
  email,
  otp,
  setOtp,
  resendLeft,
  onResend,
  inputsRef,
}: {
  email: string;
  otp: string;
  setOtp: (v: string) => void;
  onVerify: () => void;
  verifying: boolean;
  resendLeft: number;
  onResend: () => void;
  inputsRef: React.MutableRefObject<Array<HTMLInputElement | null>>;
}) {
  function onChange(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = otp.split("");
    next[i] = d;
    const joined = next.join("").replace(/undefined/g, "");
    setOtp(joined);
    if (d && i < 5) inputsRef.current[i + 1]?.focus();
  }
  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Masukkan 6 digit kode OTP yang dikirim ke <b>{email}</b>.
      </p>

      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            inputMode="numeric"
            maxLength={1}
            value={otp[i] ?? ""}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            className="h-12 w-10 rounded-lg border border-border bg-card text-center text-base font-semibold outline-none focus:border-khaffah-primary focus:ring-2 focus:ring-khaffah-primary/30"
          />
        ))}
      </div>

      <div className="flex items-center gap-2 text-[12px] text-khaffah-neutral-dark">
        <span>Tidak menerima kode?</span>
        <button
          type="button"
          disabled={resendLeft > 0}
          onClick={onResend}
          className={`inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 ${
            resendLeft > 0
              ? "cursor-not-allowed text-khaffah-neutral-mid"
              : "hover:bg-foreground/5 text-khaffah-primary"
          }`}
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          {resendLeft > 0 ? `Kirim ulang (${resendLeft}s)` : "Kirim ulang"}
        </button>
      </div>
    </div>
  );
}

function StepSetPassword({
  pwd,
  setPwd,
  pwd2,
  setPwd2,
  show1,
  setShow1,
  show2,
  setShow2,
  pwdScore,
}: {
  pwd: string;
  setPwd: (v: string) => void;
  pwd2: string;
  setPwd2: (v: string) => void;
  show1: boolean;
  setShow1: (v: boolean) => void;
  show2: boolean;
  setShow2: (v: boolean) => void;
  pwdScore: number;
}) {
  const match = pwd && pwd2 && pwd === pwd2;

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="pwd-1"
          className="mb-1 block text-[12px] text-khaffah-neutral-dark"
        >
          Password Baru
        </label>
        <div className="flex items-center gap-2">
          <input
            id="pwd-1"
            type={show1 ? "text" : "password"}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Min. 8 karakter, kombinasi huruf & angka"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-khaffah-primary focus:ring-2 focus:ring-khaffah-primary/30"
          />
          <button
            type="button"
            onClick={() => setShow1(!show1)}
            className="rounded-lg border border-border p-2 hover:bg-foreground/5"
          >
            {show1 ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={[
              "h-2 transition-all",
              pwdScore === 0 && "w-0",
              pwdScore === 1 && "w-1/4 bg-khaffah-error",
              pwdScore === 2 && "w-2/4 bg-khaffah-secondary",
              pwdScore === 3 && "w-3/4 bg-khaffah-aqua",
              pwdScore >= 4 && "w-full bg-khaffah-primary",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="pwd-2"
          className="mb-1 block text-[12px] text-khaffah-neutral-dark"
        >
          Ulangi Password Baru
        </label>
        <div className="flex items-center gap-2">
          <input
            id="pwd-2"
            type={show2 ? "text" : "password"}
            value={pwd2}
            onChange={(e) => setPwd2(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-khaffah-primary focus:ring-2 focus:ring-khaffah-primary/30"
          />
          <button
            type="button"
            onClick={() => setShow2(!show2)}
            className="rounded-lg border border-border p-2 hover:bg-foreground/5"
          >
            {show2 ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {!match && pwd2.length > 0 && (
          <p className="mt-1 text-[12px] text-khaffah-error">
            Password tidak sama.
          </p>
        )}
      </div>

      <div className="rounded-lg border border-border bg-muted px-3 py-2 text-[12px] text-khaffah-neutral-dark">
        Password harus minimal 8 karakter dan disarankan mengandung huruf besar,
        huruf kecil, angka, dan simbol.
      </div>
    </div>
  );
}
