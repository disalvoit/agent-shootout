/**
 * RFC 4180 CSV parser and writer.
 *
 * Implement parse() and stringify() below. The exported API must stay exactly
 * as declared here. Read README.md and the issue for the acceptance criteria.
 */

/**
 * Parse CSV text into an array of records (each record an array of strings).
 * @param {string} text
 * @param {{delimiter?: string}} [options]
 * @returns {string[][]}
 */
export function parse(text, options = {}) {
  const delimiter = options.delimiter ?? ',';
  if (text.startsWith('\uFEFF')) {
    text = text.slice(1);
  }
  if (text === '') {
    return [];
  }

  const records = [];
  let record = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"') {
        if (next === '"') {
          field += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        record.push(field);
        field = '';
      } else if (ch === '\r' && next === '\n') {
        record.push(field);
        records.push(record);
        record = [];
        field = '';
        i += 2;
        continue;
      } else if (ch === '\n' || ch === '\r') {
        record.push(field);
        records.push(record);
        record = [];
        field = '';
      } else {
        field += ch;
      }
    }
    i++;
  }

  if (field !== '' || record.length > 0) {
    record.push(field);
    records.push(record);
  }

  return records;
}

/**
 * Serialise records to CSV text.
 * @param {string[][]} rows
 * @param {{delimiter?: string, eol?: string}} [options]
 * @returns {string}
 */
export function stringify(rows, options = {}) {
  const delimiter = options.delimiter ?? ',';
  const eol = options.eol ?? '\r\n';

  const escapeField = (field) => {
    const needsQuotes = field.includes(delimiter) ||
      field.includes('"') ||
      field.includes('\n') ||
      field.includes('\r') ||
      field.startsWith(' ') ||
      field.endsWith(' ');
    if (needsQuotes) {
      return '"' + field.replace(/"/g, '""') + '"';
    }
    return field;
  };

  return rows.map(record => record.map(escapeField).join(delimiter)).join(eol) + (rows.length > 0 ? eol : '');
}

export default { parse, stringify };