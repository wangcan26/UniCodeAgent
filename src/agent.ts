import {ChatDeepSeek} from '@langchain/deepseek';
import {ChatPromptTemplate} from '@langchain/core/prompts';
import {createReactAgent} from "@langchain/langgraph/prebuilt";
import {MemorySaver } from '@langchain/langgraph/web';
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { writeFileSync } from 'fs';

export interface AgentConfig {
    apiKey: string;
    tvlyKey?: string;
};

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
        const agentTools = [new TavilySearchResults({maxResults: 3})];
        //Initialize memory to persist state between graph runs
        const agentCheckpointer = new MemorySaver();
        this._impl = {
            instance: createReactAgent({
                llm,
                tools: agentTools,
                checkpointSaver: agentCheckpointer,
            }),
        }

    }

    async saveGraphVisualization(appPath: string): Promise<void> {
        try {
            const graph = await this._impl.instance.getGraphAsync();
            const image = await graph.drawMermaidPng();
            const arrayBuffer = await image.arrayBuffer();
            
            const path = require('path');
            const fs = require('fs');
            const outputDir = path.join(appPath, 'dist', 'image');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            const outputPath = path.join(outputDir, 'graphState.png');
            fs.writeFileSync(outputPath, new Uint8Array(arrayBuffer));
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async run(input: string): Promise<string> {
         //Now it's time to use
        const agentFinalState = await this._impl.instance.invoke(
            { messages: [new SystemMessage("请用中文回答"), new HumanMessage(input)] },
            { configurable: { thread_id: "42" } 
        });
        return agentFinalState.messages[agentFinalState.messages.length - 1].content;
    }
};
