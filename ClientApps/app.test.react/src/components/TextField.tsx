import {
  Skeleton,
  TextFieldProps,
  TextField as MuiTextField,
} from "@mui/material";
import { ReactNode, useRef } from "react";
import { Controller } from "react-hook-form";

type ConditionalTextInputProps =
  | {
      label?: ReactNode;
      placeholder?: never;
    }
  | {
      label?: never;
      placeholder?: string;
    };

interface Props
  extends Omit<TextFieldProps, "label" | "placeholder" | "variant"> {
  isLoading?: boolean;
}

export type TextInputProps = ConditionalTextInputProps & Props;

export default function TextField({
  name,
  isLoading,
  ...props
}: { name: string } & TextInputProps) {
  const ref = useRef<HTMLInputElement | undefined>();

  return (
    <Controller
      name={name}
      rules={{ required: true }}
      render={({ field, fieldState: { isTouched, error } }) => {
        return isLoading ? (
          <Skeleton
            sx={({ typography }) => ({ height: typography.pxToRem(48) })}
            variant="rounded"
          />
        ) : (
          <>
            <MuiTextField
              variant="standard"
              inputProps={{
                ...field,
                ref,
                value:
                  field.value === null || field.value === undefined
                    ? ""
                    : field.value,
              }}
              {...props}
              label={!!error ? error.message : props.label}
              error={!!error}
            />
          </>
        );
      }}
    />
  );
}
