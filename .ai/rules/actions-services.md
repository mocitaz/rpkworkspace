---
paths:
  - 'app/Actions/*Invoice.php,app/Actions/*Payment.php,app/Services/MatterFinancialOverview.php'
---

# Actions Services

## Use integer minor units for finance
All monetary values are integer minor units. Calculate percentage rates as integer basis points; never use float arithmetic for invoice totals, outstanding amounts, aging, or margin.
