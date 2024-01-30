import { Skeleton, SxProps, TextField, Theme } from "@mui/material";
import {
  ClipboardEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  ReactNode,
  forwardRef,
  useRef,
} from "react";
import { Controller, useFormContext } from "react-hook-form";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface NumberTextInputProps {
  name: string;
  label?: string;
  maxLength?: number;
  isLoading: boolean;
  disabled?: boolean;
  allowNegative?: boolean;
  thousandsSeparator?: boolean;
  autoFill?: string;
  autoFocus?: boolean;
  valueType: "numericString" | "number";
  displayType?: "input" | "text";
  placeholder?: string;
  prefix?: string;
  renderText?: (formattedValue: string) => ReactNode;
  suffix?: string;
  sx?: SxProps<Theme>;
  onChange?: () => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onPaste?: ClipboardEventHandler<HTMLDivElement>;
  textAlign?: "center" | "left" | "right";
}

const NumberTextInput = forwardRef<HTMLInputElement, NumberTextInputProps>(
  (
    {
      name,
      label,
      maxLength,
      isLoading,
      disabled,
      allowNegative,
      thousandsSeparator,
      autoFill,
      autoFocus,
      valueType,
      displayType,
      placeholder,
      prefix,
      suffix,
      renderText,
      sx,
      onChange,
      onFocus,
      onKeyDown,
      onPaste,
      textAlign,
    },
    ref
  ) => {
    const fieldRef = useRef<HTMLInputElement | undefined>();
    const { control, setValue } = useFormContext();
    return (
      <Controller
        name={name}
        rules={{ required: true }}
        render={({ field, fieldState: { isTouched, error } }) => {
          return isLoading ? (
            <Skeleton variant="rounded" sx={{ height: 48 }} />
          ) : (
            <NumericFormat
              allowNegative={allowNegative || false}
              autoComplete={autoFill}
              autoFocus={autoFocus}
              customInput={TextField}
              decimalScale={0}
              disabled={disabled}
              displayType={displayType}
              error={!!error}
              hiddenLabel={!label}
              getInputRef={fieldRef}
              inputProps={{
                inputMode: "decimal",
                maxLength: maxLength
                  ? maxLength + (prefix?.length || 0) + (suffix?.length || 0)
                  : undefined,
                ref,
              }}
              label={label ? (error ? error.message : label) : ""}
              name={name}
              onBlur={field.onBlur}
              onFocus={(e) => {
                fieldRef?.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "center",
                });
                onFocus?.(e);
              }}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              onValueChange={({ floatValue, value }) => {
                setValue(name, valueType === "number" ? floatValue : value);
                field.onChange(value);
              }}
              onChange={() => {
                onChange && onChange();
              }}
              placeholder={placeholder}
              prefix={prefix}
              renderText={renderText}
              suffix={suffix}
              sx={[
                {
                  input: {
                    textAlign,
                  },
                },
                ...(Array.isArray(sx) ? sx : [sx]),
              ]}
              thousandSeparator={thousandsSeparator}
              value={field.value}
              valueIsNumericString={
                valueType === "numericString" ||
                !!prefix ||
                !!suffix ||
                thousandsSeparator
              }
            />
          );
        }}
      />
    );
  }
);
export default NumberTextInput;
