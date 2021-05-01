import { ObjectSchema } from "yup";
export declare class FormValidationError extends Error {
    fieldErrors: Record<string, string>;
    constructor(message: string, fieldErrors: Record<string, string>);
}
export declare const validateInput: <T>(schema: ObjectSchema<any>, input: any) => Promise<T>;
export declare const mapErrorsToFields: (setFieldError: (fieldKey: string, errorMessage: string) => void, fieldErrors: Record<string, string>) => void;
