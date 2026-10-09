/**
 * RFC 4180 CSV parser and writer.
 *
 * The exported API must stay exactly as declared here.
 * See README.md for the acceptance criteria.
 */

/**
 * Parse CSV text into an array of records (each record an array of strings).
 * @param {string} text
 * @param {{delimiter?: string}} [options]
 * @returns {string[][]}
 */
export function parse(text, options = {}) {
  const { delimiter = ',' } = options;
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let fieldStarted = false;
  let i = 0;
  const n = text.length;

  while (i < n) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += c;
      i += 1;
      continue;
    }

    if (c === '"' && !fieldStarted) {
      inQuotes = true;
      fieldStarted = true;
      i += 1;
      continue;
    }

    if (c === delimiter) {
      row.push(field);
      field = '';
      fieldStarted = false;
      i += 1;
      continue;
    }

    if (c === '\n' || c === '\r') {
      i += c === '\r' && text[i + 1] === '\n' ? 2 : 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      fieldStarted = false;
      continue;
    }

    field += c;
    fieldStarted = true;
    i += 1;
  }

  if (fieldStarted || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

/**
 * Serialise records to CSV text.
 * @param {string[][]} rows
 * @param {{delimiter?: string, eol?: string}} [options]
 * @returns {string}
 */
export function stringify(rows, options = {}) {
  const { delimiter = ',', eol = '\r\n' } = options;
  const out = [];

  for (const row of rows) {
    const fields = row.map((value) => {
      const s = String(value);
      const needsQuotes =
        s.includes(delimiter) ||
        s.includes('"') ||
        s.includes('\n') ||
        s.includes('\r') ||
        /^\s/.test(s) ||
        /\s$/.test(s);
      return needsQuotes ? '"' + s.replace(/"/g, '""') + '"' : s;
    });
    out.push(fields.join(delimiter));
  }

  const text = out.join(eol);
  return rows.length > 0 ? text + eol : text;
}

export default { parse, stringify };
