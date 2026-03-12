import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PropsWithChildren } from "react";
const Layout = (props: PropsWithChildren) => {
  return <DashboardLayout>{props.children}</DashboardLayout>;
};

export default Layout;
