import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const Button = forwardRef<any, ButtonProps>(
  (
    { className, children, disabled, type = "button", asChild, ...props },
    ref
  ) => {
    const styles = twMerge(
      `
    w-full 
    rounded-full 
    bg-orange-600 
    border 
    border-transparent 
    px-3 
    py-3 
    disabled:cursor-not-allowed 
    disabled:opacity-50
    text-neutral-800
    font-bold
    hover:opacity-75
    transition`,
      className
    );
    return asChild ? (
      <div className={styles} ref={ref}>
        {children}
      </div>
    ) : (
      <button
        type={type}
        className={styles}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
