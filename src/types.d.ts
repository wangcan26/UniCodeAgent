// Augment the Window interface to include electronAPI
interface Window {
  electronAPI: {
    getAppPath: () => Promise<string>;
    createAgent: (key: string) => Promise<void>;
    askQuestion: (question: string) => Promise<string>;
    onInitialize: (callback: (message: string) => void) => void;
    saveGraphState: () => Promise<string | null>;
    renderMarkdown: (md: string) => Promise<string>;
  };
  mermaid: any;
}
