import { AIMessage } from "@langchain/core/messages";
import { ChatDeepSeek } from "@langchain/deepseek";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import {CompiledGraph, MessagesAnnotation, StateGraph } from "@langchain/langgraph";

//Define the function that determins whether to continue or not
function shouldContinue( {messages}: typeof MessagesAnnotation.State) {
    const lastMessage = messages[messages.length - 1] as AIMessage;

    // If the LLM makes a tool call, then we route to the "tools" node
    if (lastMessage.tool_calls?.length) {
        return "tools";
    }

    //Otherwise, we stop (reply to the user) usng the special "__end__" node 
    return "__end__"; 
}

function callWithModel(llm: ChatDeepSeek) {
    return async function(state: typeof MessagesAnnotation.State) {
        const response = await llm.invoke(state.messages);
        return {messages: response};
    }
}

export function createCustomAgent(llm: ChatDeepSeek, tools: any[]): any {
    //Define a new graph 
    const workflow = new StateGraph(MessagesAnnotation)
        .addNode("agent", callWithModel(llm))
        .addEdge("__start__", "agent")
        .addNode("tools", new ToolNode(tools))
        .addEdge("tools", "agent")
        .addConditionalEdges("agent", shouldContinue);
    const app = workflow.compile();
    return app;
}