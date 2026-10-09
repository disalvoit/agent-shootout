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
  throw new Error('parse() is not implemented yet');
}

/**
 * Serialise records to CSV text.
 * @param {string[][]} rows
 * @param {{delimiter?: string, eol?: string}} [options]
 * @returns {string}
 */
export function stringify(rows, options = {}) {
  throw new Error('stringify() is not implemented yet');
}

export default { parse, stringify };
