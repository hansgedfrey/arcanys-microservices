import { parse } from "date-fns";

export function NumberFormat(value?: number, decimalPlaces?: number) {
  return Number(value).toLocaleString(
    undefined,
    decimalPlaces !== undefined
      ? {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }
      : undefined
  );
}

export function MoneyFormat(value?: number) {
  return `\$${NumberFormat(value, 2)}`;
}
