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

  if (text.length > 0 && text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }
  if (text === '') return [];

  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let rowTouched = false;

  const commitField = () => {
    row.push(field);
    field = '';
    rowTouched = true;
  };

  const commitRow = () => {
    commitField();
    rows.push(row);
    row = [];
    rowTouched = false;
  };

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      rowTouched = true;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      rowTouched = true;
    } else if (char === delimiter) {
      commitField();
    } else if (char === '\r' || char === '\n') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      commitRow();
    } else {
      field += char;
      rowTouched = true;
    }
  }

  if (rowTouched) commitRow();

  return rows;
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

  const needsQuotes = (value) =>
    value.includes(delimiter) ||
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r') ||
    /^\s|\s$/.test(value);

  const encode = (value) => {
    const str = String(value);
    if (!needsQuotes(str)) return str;
    return '"' + str.replace(/"/g, '""') + '"';
  };

  let output = '';
  for (const row of rows) {
    output += row.map(encode).join(delimiter) + eol;
  }
  return output;
}

export default { parse, stringify };
