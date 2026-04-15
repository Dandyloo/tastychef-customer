# Tasty Chef — Customer App

> "Fresh. Fast. Tasty." — For a Tasty Satisfaction

A mobile-first food ordering web app for **Tasty Chef**, Cape Coast's No. 1 fast food restaurant serving the UCC community.

## Pages
- **Home** — Featured items, categories, quick add to cart
- **Menu** — Full menu with search and category filtering
- **Item Detail** — Food details, quantity selector, add to cart
- **Cart** — Review order, update quantities, order summary
- **Checkout** — Guest checkout form (no login required)
- **Confirmation** — Order confirmed with order ID
- **Tracking** — Live order status tracking

## Tech Stack
- HTML, CSS, JavaScript (Vanilla)
- localStorage for cart persistence
- Mobile-first responsive design
- No frameworks, no dependencies

## Running Locally
1. Clone the repo
2. Open in VS Code
3. Install Live Server extension
4. Right-click `index.html` → Open with Live Server
5. Open `http://127.0.0.1:5501` in browser

## 📁 Project Structure
tastychef-customer/
├── index.html          # Home page
├── menu.html           # Menu/Browse page
├── item.html           # Item detail page
├── cart.html           # Cart page
├── checkout.html       # Guest checkout
├── confirmation.html   # Order confirmed
├── tracking.html       # Order tracking
├── css/                # Stylesheets
├── js/                 # JavaScript
├── components/         # Reusable HTML components
└── assets/             # Images and mock data