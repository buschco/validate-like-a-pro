import { ObjectSchema, ValidationError } from "yup";

export const validateInput = async <T>(
  schema: ObjectSchema<any>,
  input: any
): Promise<T> => {
  await schema.validate(input, { abortEarly: false });
  return schema.cast(input);
};

export const handleFieldErrors = (
  error: any,
  setFieldError: (fieldKey: string, errorMessage: string) => void
) => {
  if (error instanceof ValidationError || error.inner != null) {
    error.inner.forEach(({ path, message }) => {
      if (path != null) {
        setFieldError(path, message);
      }
    });
  } else {
    throw error;
  }
};
