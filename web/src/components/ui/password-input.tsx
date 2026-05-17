"use client";

import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";

export const PasswordInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ ...props }, ref) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input ref={ref} type={show ? "text" : "password"} className="pr-10" {...props} />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((v) => !v)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={show ? "Ocultar senha" : "Mostrar senha"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";
