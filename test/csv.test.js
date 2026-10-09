import test from 'node:test';
import assert from 'node:assert/strict';
import { parse, stringify } from '../src/csv.js';

test('parse: simple grid, LF, trailing newline', () => {
  assert.deepEqual(parse('a,b,c\n1,2,3\n'), [['a', 'b', 'c'], ['1', '2', '3']]);
});

test('parse: works without a trailing newline', () => {
  assert.deepEqual(parse('a,b\n1,2'), [['a', 'b'], ['1', '2']]);
});

test('parse: quoted field containing the delimiter', () => {
  assert.deepEqual(parse('a,"b,c",d\n'), [['a', 'b,c', 'd']]);
});

test('parse: doubled quotes are one literal quote', () => {
  assert.deepEqual(parse('"he said ""hi""",x\n'), [['he said "hi"', 'x']]);
});

test('parse: CRLF line endings', () => {
  assert.deepEqual(parse('a,b\r\n1,2\r\n'), [['a', 'b'], ['1', '2']]);
});

test('parse: a quoted field may contain a newline', () => {
  assert.deepEqual(parse('"line1\nline2",x\n'), [['line1\nline2', 'x']]);
});

test('parse: empty fields are preserved', () => {
  assert.deepEqual(parse('a,,c\n'), [['a', '', 'c']]);
});

test('parse: leading BOM is stripped', () => {
  assert.deepEqual(parse('\uFEFFa,b\n'), [['a', 'b']]);
});

test('parse: empty input is an empty record list', () => {
  assert.deepEqual(parse(''), []);
});

test('stringify: quotes only when required', () => {
  assert.equal(stringify([['a', 'b'], ['1', '2']]), 'a,b\r\n1,2\r\n');
});

test('stringify: quotes fields with delimiter, quote or newline', () => {
  assert.equal(stringify([['a,b', 'he said "hi"', 'x\ny']]), '"a,b","he said ""hi""","x\ny"\r\n');
});

test('round-trip: parse(stringify(x)) == x', () => {
  const rows = [['a', 'b,c', '"q"', 'multi\nline', ''], ['1', '2', '3', '4', '']];
  assert.deepEqual(parse(stringify(rows)), rows);
});
