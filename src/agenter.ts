import { ChatDeepSeek } from '@langchain/deepseek';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MemorySaver } from '@langchain/langgraph/web';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { GraphVisualizer } from './utils/graph_visualizer';
import path from 'path';
import { createCustomAgent } from './agent/custom_state_graph';

export enum AgentType {
  Builtin_ReAct,
  Custom
}

export interface AgentConfig {
  apiKey: string;
  tvlyKey?: string;
  type?: AgentType;
}

export class Agenter {
  private _impl: ReturnType<typeof createReactAgent> | ReturnType<typeof createCustomAgent> | undefined;

  constructor(config: AgentConfig) {
    const llm = new ChatDeepSeek({
      model: 'deepseek-chat',
      apiKey: config.apiKey,
      temperature: 0,
    });
    const agentTools = [new TavilySearchResults({ maxResults: 3 })];
    if (config.type === undefined || config.type === AgentType.Builtin_ReAct) {
      const agentCheckpointer = new MemorySaver();
      this._impl = createReactAgent({
        llm,
        tools: agentTools,
        checkpointSaver: agentCheckpointer,
      });
    } else {
      console.log("Create Custom Agent");
      this._impl = createCustomAgent(llm, agentTools);
    }
  }

  async saveGraphVisualization(
    appPath: string
  ): Promise<void> {
    if (!this._impl) {
      return;
    }
    try {
      const graph = await this._impl.getGraphAsync();
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
    if (!this._impl) {
      return "Unknown Agent Executor";
    }
    const agentFinalState = await this._impl.invoke(
      { messages: [new SystemMessage('请用中文回答'), new HumanMessage(input)] },
      { configurable: { thread_id: '42' } }
    );
    return agentFinalState.messages[agentFinalState.messages.length - 1]
      .content as string;
  }
}
