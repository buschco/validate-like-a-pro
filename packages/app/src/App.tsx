import { Formik, useField } from "formik";
import { useState } from "react";
import { string, object, number, Asserts } from "yup";
import { mapErrorsToFields, validateInput } from "validate";
import "./styles.css";

const MyTextField = ({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) => {
  const [field, meta] = useField(name);

  return (
    <>
      <label>
        {label}
        <input type={type} {...field} />
      </label>

      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const submitLocal = async (values: any) => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const schema = object({
    name: string().required(),
    age: number()
      .transform((value, original) =>
        original == null || original === "" ? undefined : value
      )
      .required(),
  });

  const validatedInput = await validateInput<Asserts<typeof schema>>(
    schema,
    values
  );

  return `${validatedInput.name} is now ${validatedInput.age}`;
};

const submitBackend = async (values: any) => {
  const response = await fetch(`/`, {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  const { age, name } = await response.json();
  return `${name} is now ${age}`;
};

export default function App() {
  const [result, setResult] = useState<string | void>();
  return (
    <div className="App">
      <Formik
        initialValues={{ age: "", name: "" }}
        onSubmit={async (values, { setFieldError }) => {
          setResult();
          try {
            await submitLocal(values);
            const nextResult = await submitBackend(values);
            setResult(nextResult);
          } catch (error) {
            if (error.fieldErrors != null) {
              mapErrorsToFields(setFieldError, error.fieldErrors);
            }
          }
        }}
      >
        {(formik) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <MyTextField label="name" name="name" />
            <MyTextField label="age" name="age" type="number" />
            <button type="submit" onClick={() => formik.handleSubmit()}>
              submit
            </button>
            <button
              onClick={() => {
                formik.resetForm();
                setResult();
              }}
            >
              reset
            </button>
            <span>{result || "Submit for a result"}</span>
          </div>
        )}
      </Formik>
    </div>
  );
}
