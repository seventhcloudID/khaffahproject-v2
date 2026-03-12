import { PropsWithChildren } from "react";
import Screen from "@/components/layout/screen";
import ProfileMenu from "@/components/pages/account/menu";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button type="button" id="profile_sheet" className="hidden"></Button>
        </SheetTrigger>
        <Screen className="md:py-10">
          <div className="flex gap-4">
            <ProfileMenu />
            <div className="w-full lg:w-[70%] xl:w-[75%]">{children}</div>
          </div>
        </Screen>
      </Sheet>
    </>
  );
};

export default Layout;
