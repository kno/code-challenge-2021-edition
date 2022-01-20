import Ajv, { ErrorObject, Schema } from 'ajv';
import addFormats from 'ajv-formats';
import { parse } from 'csv-parse';
import fs from 'fs';
import { CasterFunctionType, Error, ErrorInfo, FormatErrorFunctionType, importerResult, Record } from './types';

export class GenericImporter {
  ok: Record[] = [];
  ko: Error[] = [];
  ajv = new Ajv();
  schema: Schema;
  columns: string[];
  formatError: (error: ErrorObject) => ErrorInfo;
  caster: (value: any, context: any) => number | string | Date;

  constructor(
    schema: Schema,
    columns: string[],
    formatError: FormatErrorFunctionType,
    caster: CasterFunctionType,
  ) {
    addFormats(this.ajv);
    this.schema = schema;
    this.columns = columns;
    this.formatError = formatError;
    this.caster = caster;
  }

  async import(filePath: string): Promise<importerResult> {
    const promise = new Promise<importerResult>((resolve) => {
      const parser = parse({
        fromLine: 2,
        trim: true,
        cast: this.caster,
        delimiter: ';',
        columns: this.columns,
      });
      fs.createReadStream(`files/${filePath}`).pipe(parser);
      let line = 0;
      const validate = this.ajv.compile(this.schema);
      parser.on('readable', () => {
        let record;
        while ((record = parser.read()) !== null) {
          line++;
          const valid = validate(record);
          if (valid) {
            this.ok.push(record);
          } else {
            this.ko.push({
              line: line,
              errors: validate.errors?.map(this.formatError) || [],
            });
          }
        }
      });
      parser.on('end', () => {
        resolve({
          ok: this.ok,
          ko: this.ko,
        });
      });
    });
    return promise;
  }
}
