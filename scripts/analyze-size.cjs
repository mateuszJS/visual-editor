#!/usr/bin/env node

/**
 * Script to analyze and display the size of the Next.js build output
 * This script analyzes the 'out' directory created by 'next build' with output: 'export'
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(process.cwd(), 'out');

/**
 * Recursively get all files in a directory with their sizes
 */
function getFilesWithSizes(dir, baseDir = dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    console.error(`Error: Directory '${dir}' does not exist.`);
    console.error('Please run "npm run build" first to generate the output.');
    process.exit(1);
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getFilesWithSizes(fullPath, baseDir));
    } else {
      const relativePath = path.relative(baseDir, fullPath);
      files.push({
        path: relativePath,
        size: stat.size,
        type: path.extname(item).slice(1) || 'no-ext',
      });
    }
  }

  return files;
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Main analysis function
 */
function analyzeSize() {
  console.log('📊 Analyzing Next.js Build Output Size\n');
  console.log(`Directory: ${OUT_DIR}\n`);

  const files = getFilesWithSizes(OUT_DIR);
  
  // Sort files by size (largest first)
  files.sort((a, b) => b.size - a.size);

  // Calculate total size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  // Group by file type
  const byType = {};
  files.forEach(file => {
    if (!byType[file.type]) {
      byType[file.type] = { count: 0, size: 0 };
    }
    byType[file.type].count++;
    byType[file.type].size += file.size;
  });

  // Display summary by type
  console.log('Summary by File Type:');
  console.log('━'.repeat(70));
  const sortedTypes = Object.entries(byType).sort((a, b) => b[1].size - a[1].size);
  
  for (const [type, stats] of sortedTypes) {
    const percentage = ((stats.size / totalSize) * 100).toFixed(1);
    console.log(
      `${type.padEnd(15)} ${stats.count.toString().padStart(5)} files  ${formatBytes(stats.size).padStart(12)}  (${percentage}%)`
    );
  }

  console.log('━'.repeat(70));
  console.log(`${'TOTAL'.padEnd(15)} ${files.length.toString().padStart(5)} files  ${formatBytes(totalSize).padStart(12)}`);
  console.log('');

  // Display top 20 largest files
  console.log('\nTop 20 Largest Files:');
  console.log('━'.repeat(70));
  
  const topFiles = files.slice(0, 20);
  for (const file of topFiles) {
    console.log(`${formatBytes(file.size).padStart(12)}  ${file.path}`);
  }

  console.log('━'.repeat(70));
  console.log(`\n✅ Analysis complete. Total build size: ${formatBytes(totalSize)}`);

  // Save analysis to JSON for programmatic use
  const analysis = {
    timestamp: new Date().toISOString(),
    totalSize,
    totalFiles: files.length,
    byType,
    files: files.map(f => ({ path: f.path, size: f.size })),
  };

  const outputPath = path.join(process.cwd(), 'build-size-analysis.json');
  fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
  console.log(`\n📄 Detailed analysis saved to: build-size-analysis.json`);
}

// Run the analysis
analyzeSize();
