import type { ResolvedConfig } from 'vite';
import type { Options } from './vite-plugin-features';
import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

type FeaturesList = Record<string, boolean>;

export function loadFeaturesModule(config: ResolvedConfig, options: Options, compile: boolean = true) {
  let buffer = execSync('php artisan features:json');
  let features = JSON.parse(buffer.toString()) as FeaturesList;

  const resolvedVendor = path.resolve(config.root, options.vendor);
  const resolvedLocal = path.resolve(config.root, options.local);

  buildFeaturesDeclarations(resolvedVendor, features);
  buildFeaturesDeclarations(resolvedLocal, features);

  if (compile) {
    return buildFeaturesModule(features);
  }

  return null;
}

function buildFeaturesModule(features: FeaturesList) {
  let lines = [];

  lines.push(`export const Features = {`);
  Object.entries(features).forEach(([name, value]) => lines.push(`  ${name}: { isEnabled: () => ${value}, isDisabled: () => ${!value} },`));
  lines.push(`};`);

  return lines.join('\n');
}

function buildFeaturesDeclarations(target: string, features: FeaturesList) {
  let directory = path.resolve(target, 'types', 'generated');
  let declarations = path.resolve(directory, 'features.d.ts');
  let lines = [];

  lines.push(`// THIS FILE IS AUTOGENERATED!`);
  lines.push(`// DO NOT EDIT!`);
  lines.push(``);
  lines.push(`declare module '$features' {`);
  lines.push(`  export const Features: {`);
  Object.entries(features).forEach(([name]) => lines.push(`    ${name}: { isEnabled: () => boolean, isDisabled: () => boolean },`));
  lines.push(`  };`);
  lines.push(`}`);
  lines.push(``);

  fs.writeFileSync(declarations, lines.join('\n'));
}
