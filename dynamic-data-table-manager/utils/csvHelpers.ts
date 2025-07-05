import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { RowData } from '@/redux/dataSlice';

export const importCSV = (file: File): Promise<RowData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as RowData[]);
      },
      error: (err) => {
        reject(err);
      },
    });
  });
};

export const exportCSV = (rows: RowData[], columns: string[]) => {
  const filteredRows = rows.map((row) => {
    const filtered: { [key: string]: any } = {};
    columns.forEach((col) => {
      filtered[col] = row[col];
    });
    return filtered;
  });

  const csv = Papa.unparse(filteredRows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'table-data.csv');
};
