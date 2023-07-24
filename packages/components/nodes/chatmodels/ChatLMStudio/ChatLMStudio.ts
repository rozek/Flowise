import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { OpenAIChat } from 'langchain/llms/openai'
import { OpenAIChatInput } from 'langchain/chat_models/openai'

class ChatLMStudio_ChatModels implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'ChatLMStudio'
        this.name  = 'chatLMStudio'
        this.type  = 'ChatLMStudio'
        this.icon  = 'lmstudio.png'
        this.category = 'Chat Models'
        this.description = 'Use LM Studio Server instead of OpenAI'
        this.baseClasses = [this.type, 'BaseChatModel', ...getBaseClasses(OpenAIChat)]
        this.inputs = [
            {
                label: 'Base Path',
                name: 'basePath',
                type: 'string',
                placeholder: 'http://localhost:1234/v1'
            },
            {
                label: 'Model Name',
                name: 'modelName',
                type: 'string',
                placeholder: 'llama-2-13b-ggmlv3.q4_0.bin'
            },
            {
                label: 'Temperature',
                name: 'temperature',
                type: 'string',   // because Flowise has problems with DE locale
                default: '0.9',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Max Tokens',
                name: 'maxTokens',
                type: 'string',   // because Flowise has problems with DE locale
                default: '-1',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Top Probability',
                name: 'topP',
                type: 'string',   // because Flowise has problems with DE locale
                default:'0.95',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Frequency Penalty',
                name: 'frequencyPenalty',
                type: 'string',   // because Flowise has problems with DE locale
                default:'1.1',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Presence Penalty',
                name: 'presencePenalty',
                type: 'string',   // because Flowise has problems with DE locale
                default:'1.1',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Timeout',
                name: 'timeout',
                type: 'number',
                optional: true,
                additionalParams: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const basePath         = nodeData.inputs?.basePath as string
        const modelName        = nodeData.inputs?.modelName as string
        const temperature      = nodeData.inputs?.temperature as string
        const maxTokens        = nodeData.inputs?.maxTokens as string
        const topP             = nodeData.inputs?.topP as string
        const frequencyPenalty = nodeData.inputs?.frequencyPenalty as string
        const presencePenalty  = nodeData.inputs?.presencePenalty as string
        const timeout          = nodeData.inputs?.timeout as string

        const obj: Partial<OpenAIChatInput> = {
            temperature: parseFloat(temperature),
            modelName,
            streaming:true
        }

        if (maxTokens)        obj.maxTokens        = parseInt(maxTokens, 10)
        if (topP)             obj.topP             = parseInt(topP, 10)
        if (frequencyPenalty) obj.frequencyPenalty = parseInt(frequencyPenalty, 10)
        if (presencePenalty)  obj.presencePenalty  = parseInt(presencePenalty, 10)
        if (timeout)          obj.timeout          = parseInt(timeout, 10)

        const model = new OpenAIChat(obj, { basePath })

        return model
    }
}

module.exports = { nodeClass: ChatLMStudio_ChatModels }
