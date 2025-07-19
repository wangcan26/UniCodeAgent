interface Window {
  electronAPI: {
    getAppPath: () => Promise<string>;
    createAgent: (key: string) => Promise<void>;
    askQuestion: (question: string) => Promise<string>;
    onInitialize: (callback: (message: string) => void) => void;
    saveGraphState: () => Promise<string | null>;
  };
}

interface Agenter {
  run(input: string): Promise<string>;
  saveGraphVisualization(appPath: string): Promise<void>;
}

interface ElectronAPI {
  getAppPath: () => Promise<string>;
  askQuestion: (question: string) => Promise<string>;
  onInitialize: (callback: (message: string) => void) => void;
  saveGraphState: () => Promise<string | null>;
}

interface IElectronAPI {
  saveGraphVisualization(appPath: string): Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    mermaid: any; // Declare mermaid on the Window object
  }
}
