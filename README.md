# agent-shootout

A tiny, dependency-free module that converts between CSV text and JavaScript
arrays. This repository exists to answer one question: **given the same issue
and the same tests, which model actually ships working code?**

## Module

`src/csv.js` exports:

```js
parse(text, { delimiter = "," }) -> string[][]
stringify(rows, { delimiter = ",", eol = "\r\n" }) -> string
```

## Rules (RFC 4180)

1. A record is one line; records are separated by CRLF. A bare LF is also
   accepted as a record separator on input.
2. Fields are separated by the delimiter (a single character, `,` by default).
3. A field may be wrapped in double quotes. Inside a quoted field the
   delimiter, a quote and a newline are all literal.
4. Inside a quoted field, `""` represents one literal `"` character.
5. A leading UTF-8 BOM (`\uFEFF`) must be ignored.
6. An empty input yields `[]`. A trailing line terminator does not create an
   extra empty record.
7. `stringify` quotes a field only when it contains the delimiter, a quote, a
   newline, or a leading/trailing space.
8. Output uses CRLF by default.

## Tests

```
node --test test/
```

No dependencies, no build step.
