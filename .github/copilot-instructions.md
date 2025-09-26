# AI Development Instructions for Yuzha Monorepo

## Project Overview

Yuzha is a modular monorepo containing multiple React applications sharing common components and utilities. The project uses Vite, TypeScript, TailwindCSS, and follows a module-based architecture.

### Key Directories

```
yuzha/
├── apps/                # Individual applications
│   ├── Launcher/       # Main launcher app
│   ├── 0Setting/      # System settings module
│   ├── 1Meng/         # Management module
│   ├── 3Database/     # Database monitoring
│   ├── 4Extra/        # Extra features
│   └── 5Rara/         # Activity tracking
├── shared/            # Shared code
│   ├── asset/         # Common assets
│   ├── auth/          # Auth utilities
│   ├── hooks/         # React hooks
│   ├── pixi/          # PixiJS integration
│   ├── storage/       # Local storage
│   └── styles/        # Common styles
```

## Architecture Patterns

1. **Module System**
   - Each app is a standalone Vite+React application
   - Apps communicate through shared storage/hooks
   - Example: See `apps/1Meng/src/App.tsx` for module structure

2. **Shared Components**
   - Common utilities in `shared/` directory
   - Path aliases: `@shared/*` for shared code
   - Example: `shared/pixi/` for PixiJS integration

3. **State Management**
   - Local storage based with event system
   - See `shared/storage/localData.ts` for data structure
   - Subscription pattern for updates

## Development Workflows

1. **Running Apps**
   ```bash
   # Start Launcher (main app)
   npm run dev:launcher
   
   # Start individual modules
   npm run dev:0setting
   npm run dev:1meng
   # etc...
   ```

2. **Port Configuration**
   - Launcher: 5000
   - 0Setting: 5001
   - 1Meng: 5002
   - 3Database: 5003
   - 4Extra: 5004
   - 5Rara: 5005

## Critical Patterns

1. **Authentication Flow**
   - Use `usePasskeySession` hook from `@shared/hooks/usePasskeySession`
   - Check `status === 'authenticated'` before operations
   - Example in any module's `App.tsx`

2. **Data Storage**
   - Import from `@shared/storage/localData`
   - Use `insertModuleSubmission`/`listModuleSubmissions`
   - Subscribe to changes with `subscribeToLocalData`

3. **Asset Management**
   - Place shared assets in `shared/asset/`
   - Reference via `/asset/...` in code
   - Configure Vite's `publicDir` for access

4. **Styling Convention**
   - TailwindCSS for all styling
   - Import shared styles from `@shared/styles/fonts.css`
   - Use app-shell class for base layout

## Common Integration Points

1. **PixiJS Integration**
   - Import from `@shared/pixi`
   - Use `PixiCore.getInstance()` singleton pattern
   - Configure via `PixiCoreConfiguration`

2. **Module Communication**
   - Share data through `localData` storage
   - Use `ModuleSubmissionRecord` interface
   - Subscribe to changes for real-time updates

Remember to maintain module independence while leveraging shared utilities.