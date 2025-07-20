import { writeFileSync } from 'fs';
import { join } from 'path';

export class GraphVisualizer {
  static async visualizeGraph(
    graph: any,
    outputDir?: string
  ): Promise<void> {
    try {
      // Try PNG generation first if output directory specified
      if (outputDir) {
        try {
          const image = await graph.drawMermaidPng();
          const arrayBuffer = await image.arrayBuffer();
          const outputPath = join(outputDir, 'graphState.png');
          writeFileSync(outputPath, Buffer.from(arrayBuffer));
        } catch (pngError) {
          console.warn('PNG generation failed, falling back to Mermaid text');
        }
      }
    } catch (error) {
      console.error('Graph visualization failed:', error);
      throw error;
    }
  }

  static convertToMermaid(graph: any): string {
    let mermaid = 'graph TD\n';
    
    // Add nodes
    graph.nodes.forEach((node: any) => {
      mermaid += `  ${node.id}["${node.id} (${node.type})"]\n`;
    });

    // Add edges
    graph.edges.forEach((edge: any) => {
      const arrow = edge.conditional ? ' -->|conditional| ' : ' --> ';
      mermaid += `  ${edge.source}${arrow}${edge.target}\n`;
    });

    return mermaid;
  }

  static generateHtmlViewer(mermaidText: string): string {
    return `<!DOCTYPE html>
<html>
<head>
  <title>Graph Viewer</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <style>.mermaid { height: 90vh; }</style>
</head>
<body>
  <div class="mermaid">
    ${mermaidText}
  </div>
  <script>mermaid.initialize({startOnLoad:true});</script>
</body>
</html>`;
  }
}
