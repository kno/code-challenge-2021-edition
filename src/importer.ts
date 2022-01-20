import { schema, columns, formatError, caster } from './validation';
import { GenericImporter } from './genericImporter';

export class Importer extends GenericImporter {

  constructor() {
    super(schema, columns, formatError, caster);
  }
}
