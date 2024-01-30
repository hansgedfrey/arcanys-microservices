import { useForm, FieldValues, FormProvider, UseFormReturn, ValidationMode } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ScrollToFormError } from ".";
import { ReactNode } from "react";

interface FormProps {
  children?: ((props: UseFormReturn) => ReactNode) | ReactNode;
  initialValues?: FieldValues;
  validationSchema?: any | (() => any);
  validateOnChange?: boolean;
  onSubmit: (values: FieldValues) => void | Promise<any>;
  mode?: keyof ValidationMode;
  shouldFocusError?: boolean;
}

export default function ReactHookForm({ children, initialValues, validationSchema, mode, shouldFocusError, onSubmit }: FormProps) {
  const formMethods = useForm({
    shouldFocusError,
    defaultValues: initialValues,
    mode: !mode ? "all" : mode,
    resolver: yupResolver(validationSchema),
    reValidateMode: "onChange",
  });

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <>
          <ScrollToFormError />
          {typeof children === "function" ? children(formMethods) : children}
        </>
      </form>
    </FormProvider>
  );
}
