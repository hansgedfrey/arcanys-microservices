import { FilledTextFieldProps } from "@mui/material";
import { ReactNode } from "react";
import { TextField } from ".";

type ConditionalTextAreaInputProps =
  | {
      label?: ReactNode;
      placeholder?: never;
    }
  | {
      label?: never;
      placeholder?: string;
    };

interface TextAreaProps
  extends Omit<FilledTextFieldProps, "label" | "placeholder" | "variant"> {
  name: string;
  label?: ReactNode;
  minRows?: number;
  placeholder?: string;
}

export type TextAreaInputProps = ConditionalTextAreaInputProps & TextAreaProps;

export default function TextAreaInput({
  minRows = 5,
  ...props
}: TextAreaInputProps) {
  return <TextField {...props} minRows={minRows} multiline />;
}
