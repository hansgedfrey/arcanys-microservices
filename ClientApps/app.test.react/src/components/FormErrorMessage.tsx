import ErrorMessage, { ErrorMessageProps } from "./ErrorMessage";
import { ErrorMessage as HookFormErrorMessage } from "@hookform/error-message";

export interface FormErrorMessageProps extends ErrorMessageProps {
  name: string;
  errors: any;
}

export default function FormErrorMessage({ name, errors, sx = [], textAlign }: FormErrorMessageProps) {
  return <HookFormErrorMessage name={name} errors={errors} render={({ message }) => <ErrorMessage message={typeof message === "string" ? message : undefined} sx={sx} textAlign={textAlign} />} />;
}
