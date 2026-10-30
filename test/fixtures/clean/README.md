# invoice-cli

Turns a CSV of hours into a PDF invoice. It reads the rate from `invoice.toml` and writes the file next to the CSV.

## Install

```bash
npm install -g invoice-cli
```

## Use

```bash
invoice hours.csv --client "PT Maju"
```

The CSV needs three columns: date, hours and a short note. Rows with zero hours are skipped. If the client has no rate in `invoice.toml`, the command stops and names the missing client instead of guessing.

## Licence

MIT
