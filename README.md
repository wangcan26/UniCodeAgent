# EHCodeAgent

An Agent that can manipulate multiple engines through mcp servers.


## Technical Implementation

### Main Components

1. **Main Process** (`src/main.ts`)
   - IPC communication with renderer process
   - Agent query and answer

2. **Preload Script** (`src/preload.ts`)
   - Exposes safe Electron APIs to renderer
   - IPC bridge between main and renderer

3. **Renderer Process** (`src/renderer.ts`)
   - UI interaction handling
   - Content display

4. **Type Definitions** (`src/types.d.ts`)
   - Type safety for Electron API

## Configuration

The application uses a `.env` file for configuration:

```
OPENAI_API_KEY=your_openai_api_key_here
```

Required:
- `OPENAI_API_KEY`: Your OpenAI API key (format: sk-[32 hex characters])

## Usage
1. Configure your `.env` file with a valid OpenAI API key
2. Start the application

## Development

```bash
npm install
npm run build
npm start
```

## Screenshot

![Application Screenshot]()
