# Guidance & Policy Content v19

Last reviewed: 2026-07-29

## Purpose

This content system supports the MBN customer storefront for account purchase, rental, installment, deposit, handover, refund, complaint and account-safety flows. It is operational copy, not a substitute for formal legal advice.

## Canonical content structure

Each major guidance/policy page may contain:

- scope and last-reviewed date;
- quick facts shown before long content;
- pre-transaction checklist;
- ordered operating process;
- detailed sections and rules;
- responsibilities of buyer, seller, renter, lessor and MBN;
- required evidence;
- warnings and external references.

The structure is stored in `src/data/knowledgeBase.js` and rendered by `src/pages/KnowledgePage.jsx`.

## Legal and operational references reviewed

- Vietnam Law on Protection of Consumers' Rights 2023, effective 2024-07-01.
- Decree 55/2024/ND-CP detailing the consumer-protection law.
- Vietnam Ministry of Industry and Trade e-commerce management portal.
- Official Garena Vietnam support resources.
- Official TeaMobi/Gomobi resources.

## Important product constraints

- Trò chơi-publisher terms can limit or prohibit account transfer, sale, sharing or rental.
- MBN must not present every game account as legally or technically transferable.
- Price, service fees, deposit, installment amount, deadlines and cancellation consequences must be visible before confirmation.
- Any penalty, deduction or non-refundable amount must be disclosed before the customer confirms the transaction.
- Write actions never fall back to mock success.
- Production publication requires review by the operating entity and qualified legal counsel.

## Typography changes

Máy tính readability was increased selectively:

- body: 15px;
- navigation/sidebar: 13–16px;
- product cards: 12–15px;
- detail values: 13px, price 19px;
- modal body: 14px;
- policy body: 14px with 1.72 line-height;
- policy headings: 16–23px.

Điện thoại sizes remain compact to protect layout.
