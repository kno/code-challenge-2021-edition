import { ErrorObject } from 'ajv';

export type Record = {
  code: string;
  issuedDate: Date;
  ownerName: string;
  contactName: string;
  subtotal: number;
  taxes: number;
  total: number;
  status: string;
};

export type ErrorInfo = {
  property: string;
  message: string;
};

export type Error = {
  line: number;
  errors: ErrorInfo[];
};

export type importerResult = {
  ok: Record[];
  ko: Error[];
};

export type FormatErrorFunctionType = (error: ErrorObject) => ErrorInfo;
export type CasterFunctionType = (
  value: any,
  context: any,
) => number | string | Date;
