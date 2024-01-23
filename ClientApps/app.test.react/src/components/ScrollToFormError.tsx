import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ScrollToFormError() {
  const {
    formState: { errors, isSubmitting, isValidating },
  } = useForm();

  useEffect(() => {
    if (Object.keys(errors).length > 0 && isSubmitting && !isValidating) {
      const errorElement = window.document.getElementsByClassName("Mui-error")[0];

      if (errorElement) {
        errorElement.parentElement?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }
  }, [errors, isSubmitting, isValidating]);
  return null;
}
