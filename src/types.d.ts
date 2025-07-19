interface Window {
  electronAPI: {
    getAppPath: () => Promise<string>;
    createAgent: (key: string) => Promise<void>;
    askQuestion: (question: string) => Promise<string>;
    onInitialize: (callback: (message: string) => void) => void;
    saveGraphState: () => Promise<{ 
      success: boolean;
      error?: string;
      message?: string 
    }>;
  };
}

interface Agenter {
  run(input: string): Promise<string>;
  saveGraphVisualization(appPath: string): Promise<void>;
}
