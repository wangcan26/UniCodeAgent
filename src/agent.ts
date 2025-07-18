import {ChatDeepSeek} from '@langchain/deepseek';
import {ChatPromptTemplate} from '@langchain/core/prompts';

export interface AgentConfig {
    apiKey: string;
};

export class Agenter {
    private llm: ChatDeepSeek;

    constructor(config: AgentConfig) {
        this.llm = new ChatDeepSeek({
            model: 'deepseek-chat',
            apiKey: config.apiKey,
            temperature: 0,
        });
    }

    async run(input: string): Promise<string> {
        const systemTemplate = "Translate the following from Chinese into {language}";
        const prompt = ChatPromptTemplate.fromMessages([
            ['system', systemTemplate],
            ['user', input],
        ]);
        const promptValue = await prompt.format({
            language: 'English',
        });
        const response = await this.llm.invoke(promptValue);
        if (Array.isArray(response.content)) {
            return '';
        }
        return response.content;
    }
};