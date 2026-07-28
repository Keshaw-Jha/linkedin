import type { ButtonHTMLAttributes } from "react";
import classes from "./Button.module.scss";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  outline?: boolean;
};

export function Button({ outline, children, ...others }: ButtonProps) {
  return (
    <button
      className={`${classes.root} ${outline ? classes.outline : ""}`}
      {...others}>
      {children}
    </button>
  );
}
