# Security Policy & Key Isolation

## API Key Protection
- Environment variables (`VITE_GEMINI_API_KEY`) are managed via runtime environment variables.
- No static API keys or sensitive credentials are committed to version control (`.gitignore` enforced).
- Client-side interactions utilize restricted endpoints to prevent unauthorized access.

## Reporting Vulnerabilities
If you discover a potential security issue, please open an issue in this repository.
