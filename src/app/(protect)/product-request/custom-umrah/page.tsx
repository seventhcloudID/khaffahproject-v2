import { Suspense } from "react";
import ContextForm from "@/components/pages/request-product/context_form";

const PaketRequestCreate = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <ContextForm />
    </Suspense>
  );
};

export default PaketRequestCreate;
