<<<<<<< HEAD
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
=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> eea7bc8 (Initial commit: Vite React checkout form)
