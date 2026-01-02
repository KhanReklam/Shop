# Khan Reklam — Shop

A minimal single-page storefront for *Khan Reklam* that loads categories and products from a Firebase Realtime Database and lets customers build an order and send it via WhatsApp.
---

## 🚀 Features

- Dynamic categories and products loaded from Firebase Realtime Database
- Responsive, mobile-first single-page UI
- Product quantity controls and order summary
- WhatsApp order composition with prefilled message
- Image lightbox preview and smooth UI interactions
- Ready for static deployment (Cloudflare Workers via Wrangler)

---

## 📋 Quick Start

### Prerequisites

- A modern web browser
- (Optional) Node.js for local static server or Wrangler for Cloudflare deploy

### Run locally (recommended)

1. Clone the repo:

   ```bash
   git clone <your-repo-url>
   cd Shop
   ```

2. Run a simple static server in the project root (choose one):

   - Node: `npx serve .`
   - Python: `python -m http.server 8000`
   - VS Code: use the Live Server extension

3. Open the site (e.g., `http://localhost:5000` or `http://localhost:8000`).

> Note: Opening `index.html` directly in a browser works for most UI behaviors, but using an HTTP server avoids CORS/fetch restrictions.

---

## ⚙️ Configuration

Key configuration values are defined in `script.js`:

- `BASE_URL` — Firebase Realtime Database base URL (must expose `/categories.json` and `/products.json`)
- `WHATSAPP_PHONE` — phone number used to compose the WhatsApp message (the code currently prefixes `+994`)

Recommendation: move these into a `config.js` or environment process before publishing to production to avoid hardcoding test values.

---

## ☁️ Deployment (Cloudflare Workers Assets)

This repo includes `wrangler.jsonc` configured to publish the project as static assets with Cloudflare Workers.

1. Install Wrangler: `npm i -g wrangler` or follow the Cloudflare docs
2. Authenticate: `wrangler login`
3. Preview locally (optional): `wrangler dev`
4. Publish: `wrangler publish`

Make sure the Firebase DB is reachable from the published domain.

---

## 🧾 Usage

- Browse categories from the top navigation.
- Click `+` / `-` to update quantities for products.
- Open the order popup and press **"WhatsApp ilə Göndər"** to open WhatsApp with the prefilled order message.

Example composed WhatsApp message:

```
*Sifariş siyahısı:*

1x Məhsul A — 10.00 AZN
2x Məhsul B — 7.00 AZN

Ümumi məbləğ: 24.00 AZN
```

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or a pull request. Add tests or extra documentation for non-trivial changes.

---

## 📷 Screenshots / Demo

Consider adding screenshots to `img/` (PNG, 1280×720 suggested) and linking a demo URL here if you have a live deployment.

---

## 📜 License

License: **[INSERT LICENSE HERE]** — e.g., MIT, Apache-2.0. Please confirm the desired license.

---

## ✉️ Contact / Author

Author: **[YOUR NAME]**  
Contact: **[YOUR EMAIL or SOCIAL]**

Business: Khan Reklam

---

## Notes & Recommendations

- Replace hardcoded Firebase and phone constants before going to production.
- If the Firebase DB should be private, document how to provide an authenticated public read endpoint or implement an admin interface.
- Add a simple CI (GitHub Actions) for linting and optionally auto-publish with Wrangler on merges to `main`.

---

If you want, I can add screenshots, badges (license/demo), and a short `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` next — tell me the project name to use in the title, the author contact, preferred license, and any screenshots or live demo URL to include.