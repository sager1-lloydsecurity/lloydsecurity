# Lloyd Security

A modern, responsive site for Lloyd Security built with Eleventy, CSS, and JavaScript.

## Run locally

Install Node.js, then run `npm install` and `npm start`. Eleventy serves the generated site locally. For a production build, run `npm run build`; the output is written to `_site/`.

The editable pages live in `src/`. Shared markup is in `src/_includes/`, and system page content is in `src/_data/systems.js`. Eleventy keeps the existing output filenames for deployment compatibility.

## Contact form

The contact page submits directly through FormSubmit to `sage@lloydsecurity.com`, so visitors do not need an email application. The first submission requires confirming the recipient address through FormSubmit's activation email. The form also includes a hidden honeypot field for basic spam filtering.

## AI assistant

The chat widget uses local guided replies when the site is opened as static files. When deployed to Vercel, it can use the serverless endpoint in `api/chat.js` for real AI responses.

Set the `OPENAI_API_KEY` environment variable in the deployment project. `OPENAI_MODEL` is optional and defaults to `gpt-4o-mini`. Never place the API key in `script.js` or any browser-visible file.

## Deployment

Deploy the generated `_site/` directory after running `npm run build`. Treat `src/` as the source of truth; the root-level HTML files are retained for compatibility with the existing static deployment. Configure `OPENAI_API_KEY` in the deployment provider when enabling live AI assistant responses.
