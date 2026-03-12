"use client";

import { Suspense } from "react";
import ContextForm from "@/components/pages/checkout/umrah/context_form";

function CheckoutContent() {
  return <ContextForm />;
}

const Checkout = () => {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
};

export default Checkout;
