import { Importer } from './importer';

describe('demo', () => {
  it('should import successfully the import-success file', async () => {
    const importer = new Importer();
    const result = await importer.import('import-success.csv');
    expect(result.ok.length).toBe(2);
    expect(result.ko.length).toBe(0);
    expect(result.ok[0]).toBe({
      code: 'F001',
      issuedDate: '2021/04/17',
      owner: {
        name: 'John Doe S.L.',
      },
      contact: {
        name: 'Jane Roe',
      },
      subtotal: 100.0,
      taxes: 21.0,
      total: 121.0,
      status: 'issued',
    });
    expect(result.ok[1]).toBe({
      code: 'F002',
      issuedDate: '2021/04/18',
      owner: {
        name: 'John Doe S.L.',
      },
      contact: {
        name: 'Jane Roe',
      },
      subtotal: 200.0,
      taxes: 42.0,
      total: 242.0,
      status: 'draft',
    });
  });

  it('should import successfully the import-with-errors file', async () => {
    const importer = new Importer();
    const result = await importer.import('import-with-errors.csv');
    expect(result.ok.length).toBe(1);
    expect(result.ko.length).toBe(4);
    expect(result.ko[0]).toBe({
      line: 2,
      field: 'status',
      message: 'invalid',
    });
    expect(result.ko[1]).toBe({
      line: 3,
      field: 'owner.name',
      message: 'required',
    });
    expect(result.ko[2]).toBe({
      line: 4,
      field: 'code',
      message: 'required',
    });
    expect(result.ko[3]).toBe({
      line: 5,
      field: 'total',
      message: 'invalid',
    });
  });
});
