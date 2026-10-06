/**
 * Document shell. `preview` renders a body-only fragment (for the hosted preview),
 * the normal build renders a full, SEO-ready HTML document.
 */
export function Document({ head, css, body, preview = false, lang = 'en-US' }) {
  if (preview) return `${head}\n<style>${css}</style>\n${body}\n`;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head}
<style>${css}</style>
</head>
<body>
${body}
</body>
</html>
`;
}

/** Inline JSON safely inside a <script> tag. */
export const jsonScript = (id, data) =>
  `<script type="application/json" id="${id}">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
