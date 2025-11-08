#!/usr/bin/env node
/**
 * Get changed packages in the monorepo
 * This script detects which packages have changed based on git diff
 */

import { execSync } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const packagesDir = join(process.cwd(), 'packages');

// Get all packages
function getAllPackages() {
  if (!existsSync(packagesDir)) {
    return [];
  }
  return readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

// Get changed packages based on git diff
function getChangedPackages() {
  try {
    // Get the base branch (main or master)
    const baseBranch = process.env.GITHUB_BASE_REF || 'main';

    // Get changed files
    const changedFiles = execSync(`git diff --name-only origin/${baseBranch}...HEAD`, {
      encoding: 'utf-8',
    })
      .trim()
      .split('\n')
      .filter((line) => line.trim());

    const packages = getAllPackages();
    const changedPackages = new Set();

    for (const file of changedFiles) {
      for (const pkg of packages) {
        if (file.startsWith(`packages/${pkg}/`)) {
          changedPackages.add(pkg);
        }
      }
    }

    return Array.from(changedPackages);
  } catch {
    // If git command fails (e.g., in CI without proper setup), return all packages
    console.warn('Warning: Could not detect changed packages, returning all packages');
    return getAllPackages();
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const changedPackages = getChangedPackages();
  console.log(changedPackages.join('\n'));
}

export { getChangedPackages, getAllPackages };
