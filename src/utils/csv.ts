export interface ParsedCSV {
  headers: string[];
  rows: string[][];
}

// RFC 4180-compliant CSV parser — handles embedded newlines in quoted fields
export function parseCSV(text: string): ParsedCSV {
  const records: string[][] = [];
  let i = 0;
  const len = text.length;

  while (i < len) {
    // Skip a single leading \r\n or \n between records
    if (records.length > 0) {
      if (text[i] === '\r' && text[i + 1] === '\n') { i += 2; }
      else if (text[i] === '\n') { i++; }
    }
    if (i >= len) break;

    const record: string[] = [];

    while (i < len) {
      if (text[i] === '"') {
        // Quoted field
        i++; // skip opening quote
        let field = '';
        while (i < len) {
          if (text[i] === '"') {
            if (text[i + 1] === '"') {
              field += '"';
              i += 2;
            } else {
              i++; // skip closing quote
              break;
            }
          } else {
            field += text[i++];
          }
        }
        record.push(field);
      } else {
        // Unquoted field — read until comma or newline
        let field = '';
        while (i < len && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') {
          field += text[i++];
        }
        record.push(field.trim());
      }

      // After each field: comma → next field, newline/EOF → end of record
      if (i < len && text[i] === ',') {
        i++;
      } else {
        break;
      }
    }

    if (record.length > 0) records.push(record);
  }

  // Filter completely empty records (trailing newlines)
  const nonEmpty = records.filter((r) => r.some((f) => f.length > 0));
  if (nonEmpty.length === 0) return { headers: [], rows: [] };

  const [headers, ...rows] = nonEmpty;
  return { headers, rows };
}
