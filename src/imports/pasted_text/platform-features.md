ADVANCED PLATFORM FEATURES

The platform is not merely a Point-of-Sale system. It is a hybrid POS, Credit Management, Inventory Management, and Business Intelligence platform built specifically for Filipino sari-sari stores.

OPERATIONAL RESILIENCE

Frictionless Offline Mode

The entire mobile POS terminal must continue functioning even without internet access.

The following modules operate offline:

• Product scanning
• Manual product entry
• Cart management
• Checkout processing
• Utang recording
• Receipt generation

When connectivity returns, transactions automatically synchronize to the cloud without user intervention.

Display a subtle "Offline Mode Active" badge whenever internet connectivity is unavailable.

MOBILE POS EXPERIENCE

Customer Gatekeeper CRM

Every transaction begins with customer identification.

Default:
Walk-in Customer

Alternative:
Registered Customer

When a registered customer is selected, immediately reveal:

• Customer Name
• Outstanding Balance
• Available Credit Limit
• Credit Score Badge

Badge States:

Green
"GOOD STANDING"

Yellow
"MONITOR"

Red
"HIGH RISK"

This information must appear before any product entry begins.

ENTRY MODE BRANCHING

Before checkout starts, present a dedicated workflow selection screen.

Large Bento Button #1

📷 Gamitin ang Scanner

Description:
Scan branded goods continuously using the device camera.

Large Bento Button #2

⌨️ Manual na Paghahanap

Description:
Search products manually or select from quick-tap inventory shortcuts.

The chosen workflow opens independently.

Never combine scanner and search into the same screen.

CAMERA BARCODE SCANNER

Create a live camera scanning screen.

Features:

• Full-screen viewfinder
• Scanning target overlay
• Continuous scanning
• Product instantly added to cart
• Small confirmation toast after each scan

Example:

✓ Nescafe 3-in-1 Added

MANUAL PRODUCT ENTRY

Provide a touch-first product interface.

Top:
Search Bar

Below:
Quick-Tap Product Grid

Examples:

• 1kg Rice
• Repacked Sugar
• Cooking Oil 250ml
• Sardines
• Safeguard White
• Nescafe 3-in-1

Buttons should be large enough for one-handed operation.

ACTIVE CART MANAGEMENT

The cart must remain visible and highly legible.

Each item row includes:

• Product Name
• Unit Price
• Quantity
• Subtotal

Quantity Controls:

[-]   3   [+]

Stepper buttons must be oversized.

Grand Total updates in real-time.

SMART AUTO-MATH

Upon entering the amount tendered:

Example

Total:
₱238

Tendered:
₱500

The interface immediately calculates:

SUKLI
₱262

Interaction:

• Background dims slightly
• Sukli glows bright green
• Number animates upward
• Becomes primary focal point

PAYMENT GATEWAY

Display four large action buttons.

CASH

GCASH

MAYA

UTANG

Color Logic

Cash
Success Green

GCash
Action Blue

Maya
Success Green

Utang
Functional Amber

Buttons must be optimized for rapid cashier use.

UTANG VALIDATION ENGINE

When UTANG is selected:

IF CUSTOMER = WALK-IN

Trigger a hard-block modal.

Title:

Hindi Maaaring Mag-Utang

Message:

Please select a registered customer.

Interaction:

• Modal shakes
• Walk-in dropdown turns red
• UTANG button disabled

IF REGISTERED CUSTOMER

Verify:

• Current balance
• Available credit limit
• Risk score

Approve only if credit conditions are met.

DIGITAL E-RECEIPTS

After successful checkout display:

Transaction Summary

Customer Name

Items Purchased

Total Amount

Payment Method

Options:

• View Receipt
• Print Receipt
• Send E-Receipt

WEB COMMAND CENTER

SINGLE-SCREEN ARCHITECTURE

The desktop dashboard must fit inside a single viewport.

Requirements:

• h-screen layout
• overflow-hidden root container
• no browser page scrolling

Vertical space is intelligently divided between modules.

INTERNAL OVERFLOW SYSTEM

Large datasets scroll only inside their respective cards.

Examples:

• Recent Sales
• Top Debtors
• Transaction Logs

The dashboard itself never moves.

REAL-TIME ANALYTICS

Metrics Row:

Benta Ngayon

Tubong Inaasahan

At-Risk Capital

Inventory Value

Active Utang Accounts

All values should update live.

AT-RISK CAPITAL MONITOR

Create a dedicated financial risk module.

Displays:

• Total unpaid debt
• Overdue debt
• Accounts at risk

When overdue balances increase:

• Amount animates upward
• Card emits soft red glow
• Warning pulse appears

DEBT AGING VISUALIZATION

Display aging buckets:

0-7 Days

8-30 Days

31-60 Days

61+ Days

Use a modern fintech chart.

DYNAMIC RISK BADGING

Customer statuses automatically change.

GOOD STANDING
Green

MONITOR
Amber

OVERDUE
Red

When overdue:

• Badge stretches
• Color transitions Amber → Red
• Debt amount becomes red
• Subtle glowing effect

FULL-WIDTH INVENTORY MANAGEMENT

Inventory cards should maximize horizontal space.

Each row contains:

Product Icon

Product Name

SKU

Category

Stock Count

Price

Add/Edit Action

Rows use justify-between alignment.

No cramped table layouts.

STREAMLINED SIDEBAR

Sidebar contains only:

Dashboard

POS

Utang CRM

Inventory

Analytics

Reports

Settings

Logout

Logout remains permanently anchored at the bottom.

FINAL DESIGN GOAL

The completed product must look like a venture-backed fintech platform designed in 2026.

The experience should feel premium, trustworthy, highly tactile, data-rich, and purpose-built for Filipino sari-sari store owners managing both sales and credit operations.
