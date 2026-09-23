# GitHub Pages Deployment - Fixed Issues

## Problems Fixed

### 1. **404 Errors on Page Refresh**
**Issue**: GitHub Pages returns 404 when refreshing on any route other than root because it's a static file server, not a web server with routing.

**Solution**: Implemented SPA routing support using the [spa-github-pages](https://github.com/rafgraph/spa-github-pages) technique:
- Added `public/404.html` with redirect script
- Added corresponding script in `index.html` to restore the URL
- This allows direct navigation to any route without 404 errors

### 2. **Asset Path Issues**
**Issue**: Assets were using absolute paths (`/assets/...`) which don't work when deployed to a subdirectory on GitHub Pages.

**Solution**: 
- Configured `vite.config.js` with `base: './'` to generate relative paths
- Added `<base href="./">` in index.html
- All asset paths now use `./assets/...` format

### 3. **Broken URLs Causing 404s**
**Issue**: Several hardcoded URLs were pointing to non-existent domains:
- Footer QR code pointed to `https://qrforge.app` (doesn't exist)
- OG image referenced `https://qrforge.app/og-image.png` (doesn't exist)
- Default QR data used `https://qrforge.app`

**Solution**:
- Changed all `https://qrforge.app` references to `https://example.com`
- Removed non-existent OG image meta tags
- Updated Twitter card to use `summary` instead of `summary_large_image`

## Files Modified

1. **vite.config.js** - Added `base: './'` configuration
2. **index.html** - Added SPA routing script and fixed meta tags
3. **public/404.html** - New file for GitHub Pages SPA routing
4. **src/components/Generator.tsx** - Fixed 4 hardcoded URLs
5. **src/components/Closing.tsx** - Fixed 1 hardcoded URL

## Deployment Instructions

### Deploy to GitHub Pages

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to GitHub Pages:
   - Option A: Use GitHub Actions (recommended)
   - Option B: Manually push `dist` folder to `gh-pages` branch

### Using GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to gh-pages branch
cd dist
git init
git add -A
git commit -m "Deploy to GitHub Pages"
git push -f git@github.com:USERNAME/REPO.git main:gh-pages
cd ..
```

## Testing

After deployment, verify:
- ✅ Home page loads without errors
- ✅ All assets (CSS, JS) load correctly
- ✅ Page refresh on any route works (no 404)
- ✅ QR code generation works
- ✅ Download buttons work
- ✅ All navigation links work
- ✅ No console errors

## Notes

- The app uses hash-based routing internally, so all routes work with the SPA redirect
- The 404.html file is essential for GitHub Pages to handle client-side routing
- All URLs in the code now use `https://example.com` as a safe placeholder
- The build output is optimized and ready for production
