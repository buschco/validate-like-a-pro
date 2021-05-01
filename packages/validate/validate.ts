import { ObjectSchema, ValidationError } from "yup";

export class FormValidationError extends Error {
  fieldErrors: Record<string, string>;

  constructor(message: string, fieldErrors: Record<string, string>) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

const errorsToMap = (verror: ValidationError): Record<string, string> => {
  if (verror == null || verror.inner == null) return {};
  const { inner } = verror;

  return inner.reduce(
    (errorsMapped, { message, path }) =>
      path == null
        ? errorsMapped
        : {
            ...errorsMapped,
            [path]: message,
          },
    {}
  );
};

export const validateInput = async <T>(
  schema: ObjectSchema<any>,
  input: any
): Promise<T> => {
  try {
    await schema.validate(input, { abortEarly: false });
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new FormValidationError(
        "Please check the fields below",
        errorsToMap(error)
      );
    }
    throw error;
  }
  return schema.cast(input);
};

export const mapErrorsToFields = (
  setFieldError: (fieldKey: string, errorMessage: string) => void,
  fieldErrors: Record<string, string>
) => {
  Object.keys(fieldErrors).forEach((fieldKey) =>
    setFieldError(fieldKey, fieldErrors[fieldKey])
  );
};
