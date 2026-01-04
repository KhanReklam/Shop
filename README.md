# Khan Reklam — Shop

A minimal, responsive, mobile-first single-page storefront for **Khan Reklam**. It loads categories and products from a Firebase Realtime Database, allows customers to build an order, and composes an order message for WhatsApp.

---

## 🚀 Features

- Loads categories & products from Firebase Realtime Database
- Responsive, mobile-first UI with image preview
- Quantity controls, order summary, and WhatsApp message composition
- No build step required — plain HTML, CSS, and JavaScript
- Ready for static deployment (Cloudflare Workers via Wrangler)

---

## 📸 Screenshot

![App screenshot](./img/hero.jpeg)

---

## ⚙️ Quick Start

### Prerequisites

- A modern web browser
- (Optional) Node.js for a local static server or `wrangler` for Cloudflare deploy

### Run locally

1. Clone the repo:

   ```bash
   git clone <your-repo-url>
   cd Shop
   ```

2. Serve the project root with a static server:

   - Node: `npx serve .`
   - Python: `python -m http.server 8000`
   - VS Code: Live Server

3. Open `http://localhost:8000` (or the server URL).

> Use an HTTP server to avoid CORS/fetch restrictions when loading data from Firebase.

---

## 🔧 Configuration

This project uses a small runtime configuration for Firebase and WhatsApp settings. Example values are provided in `config.example.js`.

- `BASE_URL` — Firebase Realtime Database base URL (must expose `/categories.json` and `/products.json`)
- `WHATSAPP_PHONE` — phone number used to compose the WhatsApp message (country code should be provided or the code will prefix `+994` as currently implemented)

To use custom values, copy `config.example.js` → `config.js` and edit values before serving/publishing.

---

## 🧪 Development

- No bundler or build step required — edit `index.html`, `style.css`, and `script.js` directly.
- Use your editor + a static server to preview.

---

## ☁️ Deployment (Cloudflare Workers)

This repo includes `wrangler.jsonc` configured to serve the project as static assets via Cloudflare.

1. Install Wrangler: `npm i -g wrangler` or follow Cloudflare docs
2. Authenticate: `wrangler login`
3. Preview: `wrangler dev`
4. Publish: `wrangler publish`

Ensure `BASE_URL` points at a public/accessible Firebase endpoint when deployed.

---

## 🗂 File structure

```
index.html
script.js
style.css
img/hero.jpeg
wrangler.jsonc
README.md
```

---

## 🤝 Contributing

Contributions welcome — please open issues or pull requests. See `CONTRIBUTING.md` for the contribution guide and `CODE_OF_CONDUCT.md` for expected behavior.

---

## 📜 License

This project is available under the **MIT License**. See `LICENSE` for details.

---

## ✉️ Author / Contact

Author: **[YOUR NAME]**  
Contact: **[YOUR EMAIL or SOCIAL]**

---

## Notes

- Replace hardcoded Firebase and phone constants before going to production.
- If Firebase should be private, consider implementing an authenticated API or restricted endpoints.
- I can add badges, a demo link, and CI for automatic deploys if you want.
