# Build Size Analysis Scripts

This directory contains scripts for analyzing and comparing Next.js build output sizes.

## Scripts

### `analyze-size.cjs`

Analyzes the build output in the `out` directory and provides a detailed report of file sizes.

**Usage:**
```bash
npm run build   # First build the project
npm run size    # Analyze the build output
```

**Output:**
- Console output with size breakdown by file type and top 20 largest files
- `build-size-analysis.json` file with detailed analysis data

### `compare-size.cjs`

Compares two build size analyses to detect changes in file sizes.

**Usage:**
```bash
node scripts/compare-size.cjs base-size-analysis.json current-size-analysis.json
```

**Features:**
- Compares total build size
- Lists files that changed in size
- Normalizes Next.js hash-based filenames for accurate comparison
- Detects new, removed, and modified files
- Provides warnings if build size increases significantly (>5%)

## GitHub Workflow

The `build-size-analysis.yml` workflow automatically runs size comparison on pull requests to the `develop` branch. It:

1. Builds the current PR branch
2. Builds the base `develop` branch
3. Compares the sizes and posts a comment on the PR with the results

## Bundle Analyzer

For interactive bundle analysis, use:

```bash
npm run analyze
```

This will build the project with the Next.js bundle analyzer enabled, which will open an interactive visualization in your browser showing the composition of your bundles.

## Configuration

The bundle analyzer is configured in `next.config.ts` using `@next/bundle-analyzer`. It only runs when the `ANALYZE` environment variable is set to `true`.
