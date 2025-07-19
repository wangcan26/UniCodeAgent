declare global {
  interface Window {
    mermaid: {
      initialize(config: object): void;
      init(config: object | undefined, nodes: string | HTMLElement | NodeListOf<HTMLElement>): void;
      contentLoaded(): void;
    };
  }
}

export {};
