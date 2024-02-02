import {
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
  Skeleton,
} from "@mui/material";
import equal from "deep-equal";
import { useMemo, useRef } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";

interface Option<T> {
  label: string;
  value: T;
}

export interface SelectProps<T>
  extends Pick<MuiSelectProps, "disabled" | "label" | "name"> {
  isLoading?: boolean;
  options: Option<T>[] | string[];
  onChange?: (selected: string | Option<T>) => void;
  name: string;
}

export default function Select<T>({
  disabled,
  isLoading,
  label,
  name,
  onChange,
  options,
}: SelectProps<T>) {
  const ref = useRef<HTMLSelectElement | undefined>();
  const isStringArray = useMemo(
    () =>
      !options?.length || options.some((option) => typeof option === "string"),
    [options]
  );
  const isStringValue = useMemo(
    () =>
      isStringArray ||
      (options as Option<T>[]).some(
        (option) => typeof option.value === "string"
      ),
    [isStringArray, options]
  );
  const stringOptions = useMemo(
    () =>
      isStringArray
        ? (options as string[])
        : (options as Option<T>[]).map((o) => o.label),
    [isStringArray, options]
  );
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field, fieldState: { isTouched, error } }) => {
        return (
          <FormControl disabled={disabled} error={!!error} fullWidth>
            {isLoading ? (
              <Skeleton variant="rounded" height="48px" />
            ) : (
              <>
                <InputLabel>{!!error ? error.message : label}</InputLabel>
                <MuiSelect
                  label={label}
                  disabled={disabled}
                  onBlur={field.onBlur}
                  onChange={(e) => {
                    const selectValue =
                      (isStringArray
                        ? e.target.value
                        : (options as Option<T>[]).find(
                            (o) => o.label === e.target.value
                          )?.value) || (isStringValue ? "" : undefined);
                    setValue(name, selectValue, { shouldTouch: true });

                    onChange && onChange(selectValue as string | Option<T>);
                    field.onChange(selectValue as string | Option<T>);
                  }}
                  ref={ref}
                  value={
                    (isStringArray
                      ? field.value
                      : (options as Option<T>[]).find((option) =>
                          equal(option.value, field.value)
                        )?.label) || ""
                  }
                  sx={{
                    ...(!!error && {
                      "& .MuiSvgIcon-root": {
                        color: "error.main",
                      },
                    }),
                  }}
                >
                  {stringOptions.map((label) => (
                    <MenuItem key={label} value={label}>
                      {label}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </>
            )}
          </FormControl>
        );
      }}
    />
  );
}
