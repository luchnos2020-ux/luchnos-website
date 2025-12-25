#!/usr/bin/env node
/**
 * UTF-8 Encoding Validator
 * Checks all text files for proper UTF-8 encoding
 * Run: node scripts/validate-encoding.js
 */

const fs = require('fs');
const path = require('path');

const EXTENSIONS = ['.html', '.css', '.js', '.json', '.md', '.txt', '.svg'];
const IGNORE_DIRS = ['node_modules', '.git', '.reference', 'dist', 'build'];

// Common encoding issues - characters that indicate broken UTF-8
const BROKEN_PATTERNS = [
  /Ã©/g,  // é encoded incorrectly
  /Ã¨/g,  // è encoded incorrectly
  /Ã /g,  // à encoded incorrectly
  /Ã¢/g,  // â encoded incorrectly
  /Ãª/g,  // ê encoded incorrectly
  /Ã®/g,  // î encoded incorrectly
  /Ã´/g,  // ô encoded incorrectly
  /Ã¹/g,  // ù encoded incorrectly
  /Ã§/g,  // ç encoded incorrectly
  /Å"/g,  // œ encoded incorrectly
  /â€™/g, // ' encoded incorrectly
  /â€œ/g, // " encoded incorrectly
  /â€/g,  // " encoded incorrectly
  /Ã‰/g,  // É encoded incorrectly
  /Ã€/g,  // À encoded incorrectly
  /Ãˆ/g,  // È encoded incorrectly
];

let errorCount = 0;
let fileCount = 0;

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        walkDir(filePath, callback);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (EXTENSIONS.includes(ext)) {
        callback(filePath);
      }
    }
  }
}

function checkFile(filePath) {
  fileCount++;

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];

    for (const pattern of BROKEN_PATTERNS) {
      const matches = content.match(pattern);
      if (matches) {
        issues.push(`Found "${matches[0]}" (broken encoding) - ${matches.length} occurrence(s)`);
      }
    }

    // Check for NULL bytes (binary content in text file)
    if (content.includes('\x00')) {
      issues.push('Contains NULL bytes - file may be binary or corrupted');
    }

    if (issues.length > 0) {
      errorCount++;
      console.log(`\n❌ ${filePath}`);
      issues.forEach(issue => console.log(`   - ${issue}`));
    }

  } catch (error) {
    errorCount++;
    console.log(`\n❌ ${filePath}`);
    console.log(`   - Error reading file: ${error.message}`);
  }
}

console.log('🔍 Validating UTF-8 encoding...\n');

const rootDir = path.resolve(__dirname, '..');
walkDir(rootDir, checkFile);

console.log(`\n${'─'.repeat(50)}`);
console.log(`📊 Checked ${fileCount} files`);

if (errorCount === 0) {
  console.log('✅ All files have valid UTF-8 encoding!\n');
  process.exit(0);
} else {
  console.log(`❌ Found encoding issues in ${errorCount} file(s)\n`);
  console.log('💡 To fix: Open the file in a UTF-8 capable editor and re-save with UTF-8 encoding.\n');
  process.exit(1);
}
