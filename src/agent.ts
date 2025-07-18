import {ChatDeepSeek} from '@langchain/deepseek';
import {ChatPromptTemplate} from '@langchain/core/prompts';
import {createReactAgent} from "@langchain/langgraph/prebuilt";
import { MemorySaver } from '@langchain/langgraph/web';
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

export interface AgentConfig {
    apiKey: string;
    tvlyKey?: string;
};

export interface LLMAgent {
    graph: any;
}

export class Agenter {
    private _impl: LLMAgent;

    constructor(config: AgentConfig) {
        process.env.TAVILY_API_KEY = config.tvlyKey;
        const llm = new ChatDeepSeek({
                model: 'deepseek-chat',
                apiKey: config.apiKey,
                temperature: 0,
            });
        const agentTools = [new TavilySearchResults({maxResults: 3})];
        //Initialize memory to persist state between graph runs
        const agentCheckpointer = new MemorySaver();
        this._impl = {
            graph: createReactAgent({
                llm,
                tools: agentTools,
                checkpointSaver: agentCheckpointer,
            }),
        }
    }

    async run(input: string): Promise<string> {
         //Now it's time to use
        const agentFinalState = await this._impl.graph.invoke(
            { messages: [new SystemMessage("请用中文回答"), new HumanMessage(input)] },
            { configurable: { thread_id: "42" } 
        });
        return agentFinalState.messages[agentFinalState.messages.length - 1].content;
    }
};