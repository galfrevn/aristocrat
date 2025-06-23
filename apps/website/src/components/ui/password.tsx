"use client";

import { cn } from "@/lib/utils";
import { useState, type ComponentProps } from "react";

import { AristocratIcons } from "@/components/icons";
import { Button } from "./button";

function PasswordInput({ className, type, ...props }: ComponentProps<"input">) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  return (
    <div className="relative ">
      <input
        type={isPasswordVisible ? "text" : "password"}
        data-slot="input"
        className={cn(
          "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          className
        )}
        {...props}
      />
      <Button
        onClick={togglePasswordVisibility}
        size="icon"
        variant="ghost"
        className="absolute right-1 top-1 size-7"
        type="button"
      >
        {isPasswordVisible ? <AristocratIcons.Eye /> : <AristocratIcons.EyeOff />}
      </Button>
    </div>
  );
}

export { PasswordInput };
