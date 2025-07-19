import { ChatDeepSeek } from '@langchain/deepseek';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MemorySaver } from '@langchain/langgraph/web';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { writeFileSync } from 'fs';
import { GraphVisualizer } from './utils/GraphVisualizer';
import path from 'path';

export interface AgentConfig {
  apiKey: string;
  tvlyKey?: string;
}

export interface LLMAgent {
  instance: ReturnType<typeof createReactAgent>;
}

export class Agenter {
  private _impl: LLMAgent;

  constructor(config: AgentConfig) {
    const llm = new ChatDeepSeek({
      model: 'deepseek-chat',
      apiKey: config.apiKey,
      temperature: 0,
    });
    const agentTools = [new TavilySearchResults({ maxResults: 3 })];
    const agentCheckpointer = new MemorySaver();
    this._impl = {
      instance: createReactAgent({
        llm,
        tools: agentTools,
        checkpointSaver: agentCheckpointer,
      }),
    };
  }

  async saveGraphVisualization(
    appPath: string
  ): Promise<void> {
    try {
      const graph = await this._impl.instance.getGraphAsync();
      const outputDir = path.join(appPath, 'dist', 'image');
      return await GraphVisualizer.visualizeGraph(
        graph,
        outputDir
      );
    } catch (error) {
      console.error('Error saving graph visualization:', error);
      throw error;
    }
  }

  async run(input: string): Promise<string> {
    const agentFinalState = await this._impl.instance.invoke(
      { messages: [new SystemMessage('请用中文回答'), new HumanMessage(input)] },
      { configurable: { thread_id: '42' } }
    );
    return agentFinalState.messages[agentFinalState.messages.length - 1]
      .content as string;
  }
}
