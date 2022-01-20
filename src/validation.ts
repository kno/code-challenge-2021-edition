import { ErrorObject, Schema } from 'ajv';
import { ErrorInfo } from './types';

export const schema: Schema = {
    type: 'object',
    properties: {
      code: { type: 'string', minLength: 1 },
      issuedDate: { type: 'string', format: 'date' },
      ownerName: { type: 'string', minLength: 1 },
      contactName: { type: 'string' },
      subtotal: { type: 'number' },
      taxes: { type: 'number' },
      total: { type: 'number' },
      status: { type: 'string', enum: ['draft', 'issued', 'paid'] },
    },
    required: [
      'code',
      'issuedDate',
      'ownerName',
      'contactName',
      'subtotal',
      'taxes',
      'total',
      'status',
    ],
  };

  export const columns = [
    'code',
    'issuedDate',
    'ownerName',
    'contactName',
    'subtotal',
    'taxes',
    'total',
    'status',
  ];

  export const formatError = (error: ErrorObject): ErrorInfo => {
    return {
      property: error?.instancePath?.substring(1) || '',
      message: error?.message?.includes('characters') ? 'required' : 'invalid',
    };
  };

  export const caster = (value: any, context: any): number | string | Date => {
    switch (context.index) {
      case 4:
      case 5:
      case 6:
        return parseFloat(value);
      default:
        return value;
    }
  };