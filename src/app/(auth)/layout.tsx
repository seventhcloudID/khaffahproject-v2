import Screen from "@/components/layout/screen";
import Link from "next/link";
import { PropsWithChildren } from "react";

const AuthLayout = (props: PropsWithChildren) => {
  return (
    <div className="bg-[url('/background/auth-background.png')] bg-no-repeat bg-cover bg-emerald-700 w-full h-screen md:h-[100dvh] flex items-center justify-center">
      <Screen className="w-full">
        {props.children}

        <p className="mt-4 md:mt-6 text-center text-[11px] md:text-xs text-white/80">
          Dengan melanjutkan, Anda menyetujui{" "}
          <Link
            href="/terms"
            className="font-semibold text-khaffah-tertiary underline underline-offset-2"
          >
            Syarat Layanan
          </Link>{" "}
          dan{" "}
          <Link
            href="/privacy"
            className="font-semibold text-khaffah-tertiary underline underline-offset-2"
          >
            Kebijakan Privasi
          </Link>{" "}
          kami.
        </p>
      </Screen>
    </div>
  );
};

export default AuthLayout;
