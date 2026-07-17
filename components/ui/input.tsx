import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "focus-ring flex h-12 w-full rounded-md border bg-background px-3 py-2 text-sm transition placeholder:text-muted-foreground",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
