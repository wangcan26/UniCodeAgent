# EHCodeAgent

An Agent that can manipulate multiple engines through mcp servers.

## Features
- Secure password input field

## Technical Implementation

### Main Components

1. **Main Process** (`src/main.ts`)
   - Handles file system operations
   - IPC communication with renderer process
   - Directory selection dialog
   - Agent query and answer

2. **Preload Script** (`src/preload.ts`)
   - Exposes safe Electron APIs to renderer
   - IPC bridge between main and renderer

3. **Renderer Process** (`src/renderer.ts`)
   - UI interaction handling
   - File list rendering
   - Content display

4. **Type Definitions** (`src/types.d.ts`)
   - Type safety for Electron API

## Usage
1. Enter password in the secure input field

## Development

```bash
npm install
npm run build
npm start
```

## Screenshot

![Application Screenshot]()
