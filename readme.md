2) README.md (tempel di root repo)
# Dev Tooling Setup (Monorepo)

Standar minimal biar repo ini tahan banting: TypeScript strict, ESLint + Prettier, Vitest, Husky pre-commit, lint-staged, dan CI GitHub Actions. Semua langkah idempotent dan bisa diulang.

## TL;DR
```bash
npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin \
prettier vitest @vitest/coverage-v8 ts-node husky lint-staged

npm pkg set scripts.typecheck="tsc --noEmit -p tsconfig.base.json"
npm pkg set scripts.lint="eslint . --ext .ts,.tsx"
npm pkg set scripts.lint:fix="eslint . --ext .ts,.tsx --fix"
npm pkg set scripts.format="prettier --check ."
npm pkg set scripts.format:fix="prettier --write ."
npm pkg set scripts.test="vitest run"
npm pkg set scripts.test:watch="vitest"
npm pkg set scripts.test:cov="vitest run --coverage"
npm pkg set scripts.prepare="husky install"
npm pkg set scripts.ci:verify="npm run typecheck && npm run lint && npm run test && npm run build:launcher"

npm pkg set lint-staged."*.{ts,tsx}"="[\"eslint --fix\"]"
npm pkg set lint-staged."*.{js,jsx,css,md,json}"="[\"prettier --write\"]"

npx husky init
printf '#!/usr/bin/env sh\n. \"$(dirname -- \"$0\")/_/husky.sh\"\n\nnpx lint-staged\n' > .husky/pre-commit

# Tulis file config di root:
# tsconfig.base.json, .eslintrc.json, .prettierrc, vitest.config.ts (lihat di bawah)

File Config

tsconfig.base.json

{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "jsx": "react-jsx",
    "types": ["vitest/globals"],
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["apps/Launcher/shared/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}


.eslintrc.json

{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": { "project": false, "ecmaVersion": 2022, "sourceType": "module" },
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "ignorePatterns": ["dist", "node_modules"],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports" }]
  }
}


.prettierrc

{
  "semi": true,
  "singleQuote": false,
  "printWidth": 100,
  "trailingComma": "all"
}


vitest.config.ts

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage"
    },
    include: ["**/*.test.{ts,tsx}"]
  }
});

CI (GitHub Actions)

Buat file: .github/workflows/ci.yml

name: CI
on:
  push:
    branches: [ main, develop ]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint -- --max-warnings=0
      - run: npm run test -- --ci
      - run: npm run build:launcher

Cara Pakai Harian

npm run dev:<app> → ngembangin modul

npm run test:watch → ngetes sambil ngoding

Commit → Husky jalanin lint-staged → auto-fix

PR → CI ngecek type, lint, test, build

Troubleshooting

TypeScript noise: override per app via apps/*/tsconfig.json dengan "extends": "../../tsconfig.base.json".

Lint kebanyakan bacot: edit .eslintrc.json rules.

Vitest gagal JSDOM: pastikan dependency dev lengkap dan tidak lockfile korup (rm -rf node_modules && npm ci).