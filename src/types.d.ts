interface Window {
  electronAPI: {
    getAppPath: () => Promise<string>;
    createAgent: (key: string) => Promise<void>;
    askQuestion: (question: string) => Promise<string>;
  };
}
