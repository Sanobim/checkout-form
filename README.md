# checkout-form

# Checkout Form with Validation (Pure React)

A simple e-commerce checkout form built with **pure React** (no Formik, no Yup) that validates **in real time**, shows **inline errors**, disables submit until valid, and displays a **confirmation modal** (CVV hidden, card masked).

## Features
- Real-time validation (on change & blur)
- Inline error messages per field
- Submit disabled until all fields are valid
- Confirmation modal with summary (CVV excluded; card masked **** **** **** 1234)
- Reusable input component + centralized validation utilities
- Optional Luhn check for card number

## Tech Stack
- React 18+
- Vite (dev server & build)
- No external validation libraries

## Getting Started

> **Option A — fresh project**
```bash
# Node 18+ recommended
npm create vite@latest checkout-form -- --template react
cd checkout-form
npm install
