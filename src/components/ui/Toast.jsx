// src/components/ui/Toast.jsx
import React from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { useStore } from "../../context/StoreContext";

export default function Toast() {
  const { toast } = useStore();
  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-medium animate-slide-up ${isError ? "bg-red-500" : "bg-charcoal"}`}>
      {isError ? <XCircle size={18} className="text-red-200" /> : <CheckCircle size={18} className="text-green-300" />}
      {toast.msg}
    </div>
  );
}
