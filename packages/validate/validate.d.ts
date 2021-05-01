import { ObjectSchema } from "yup";
export declare const validateInput: <T>(schema: ObjectSchema<any>, input: any) => Promise<T>;
export declare const handleFieldErrors: (error: any, setFieldError: (fieldKey: string, errorMessage: string) => void) => void;
