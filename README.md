# FreshCart

An e-commerce website built with React, Vite and Tailwind CSS. It uses the Route E-commerce API (`https://ecommerce.routemisr.com`).

## Pages

- Home, Products (search, filters, sorting, pagination), Product Details with reviews
- Categories (with subcategories) and Brands
- Cart (quantity, coupon) and Wishlist
- Checkout with saved addresses, cash and online payment, and My Orders
- Register, Login, Forgot Password flow
- My Account: addresses and settings
- Contact Us, Privacy Policy, Terms of Service

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

On Windows, copy `.env.example` to `.env` with `copy .env.example .env`.

## Environment variables

| Name | Description |
| --- | --- |
| `VITE_API_BASE` | Base URL of the API, for example `https://ecommerce.routemisr.com` |

## Build

```bash
npm run build
npm run preview
```

## Deploying to Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel (the framework is detected as Vite).
3. Add the `VITE_API_BASE` environment variable.
4. Deploy. The `vercel.json` file sends every route to `index.html`, so refreshing any page works.
