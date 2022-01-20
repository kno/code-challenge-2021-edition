import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { parse } from 'csv-parse';
import fs from 'fs';
import { Record, Error, importerResult } from './types';
import { schema, columns, formatError, caster } from './validation';

export class Importer {
  ok: Record[] = [];
  ko: Error[] = [];
  ajv = new Ajv();

  async import(filePath: string): Promise<importerResult> {
    addFormats(this.ajv);
    const promise = new Promise<importerResult>((resolve) => {
      const parser = parse({
        fromLine: 2,
        trim: true,
        cast: caster,
        delimiter: ';',
        columns: columns,
      });
      fs.createReadStream(`files/${filePath}`).pipe(parser);
      let line = 0;
      const validate = this.ajv.compile(schema);
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
              errors: validate.errors?.map(formatError) || [],
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
