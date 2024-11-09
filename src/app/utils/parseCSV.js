import Papa from "papaparse";

export function parseCSV(fileContent) {
  return new Promise((resolve) => {
    Papa.parse(fileContent, {
      header: true, // Treats the first row as headers
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
    });
  });
}
