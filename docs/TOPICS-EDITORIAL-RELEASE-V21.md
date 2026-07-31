# Bài viết editorial release v21

## Scope

The mock topic catalogue is now a pre-release editorial baseline for buying, selling, renting, instalments, deposits, payment reconciliation, disputes, refunds, account security, personal data and publisher-term risk.

## Publishing safeguards

- Treat the content as operational guidance, not legal advice.
- Review each game publisher's current terms before enabling listings.
- Replace dates, support SLAs, payment accounts and refund timelines with approved production values.
- Version policy changes and record customer acceptance for transaction-specific terms.
- Never publish OTP, passwords, recovery codes, full bank receipts or unmasked personal data.

## Nested repository warning

Earlier ZIP commands may have created `mbn-react/mbn-react`. Remove the nested directory before linting:

```bash
rm -rf ./mbn-react
```

The release ZIP is root-direct and should be extracted with `-d .` while standing in the repository root.
