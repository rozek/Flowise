import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { ChatOpenAI, OpenAIChatInput } from 'langchain/chat_models/openai'

class ChatNodeRED_ChatModels implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'ChatNodeRED'
        this.name  = 'chatNodeRED'
        this.type  = 'ChatNodeRED'
        this.icon  = 'node-red-icon.png'
        this.category = 'Chat Models'
        this.description = 'Use OpenAI-compatible Node-RED flows instead of OpenAI itself'
        this.baseClasses = [this.type, ...getBaseClasses(ChatOpenAI)]
        this.inputs = [
            {
                label: 'Base Path',
                name: 'basePath',
                type: 'string',
                default: 'http://localhost:8000/v1',
                description: 'base URL of Node-RED Server'
            },
            {
                label: 'API Key',
                name: 'openAIApiKey',
                type: 'password',
                default: 'sk-xxxx',
                description: 'API Key to authenticate request'
            },
            {
                label: 'Model Name',
                name: 'modelName',
                type: 'string',
                default: 'llama-2-13b-ggmlv3.q4_0.bin',
                description: 'desired LLM Model'
            },
            {
                label: 'Temperature',
                name: 'temperature',
                type: 'number',
                default: 0,
                optional: true,
                description: 'text generation "temperature" (0...2)'
            },
            {
                label: 'Max Tokens',
                name: 'maxTokens',
                type: 'number',
                default: -1,
                optional: true,
                additionalParams: true,
                description: 'max. number of tokens to generate (or -1)'
            },
            {
                label: 'Top Probability',
                name: 'topP',
                type: 'number',
                default:0.1,
                optional: true,
                additionalParams: true,
                description: 'top-p setting (0...1)'
            },
            {
                label: 'Frequency Penalty',
                name: 'frequencyPenalty',
                type: 'number',
                default:1.1,
                optional: true,
                additionalParams: true,
                description: 'frequency penalty (-2...2)'
            },
            {
                label: 'Stop Sequence',
                name: 'stop',
                type: 'string',
                default: '',
                description: 'text at which to stop token generation'
            },
            {
                label: 'Timeout',
                name: 'timeout',
                type: 'number',
                optional: true,
                additionalParams: true,
                description: 'timeout in milliseconds'
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const basePath         = nodeData.inputs?.basePath as string
        const openAIApiKey     = nodeData.inputs?.openAIApiKey as string
        const modelName        = nodeData.inputs?.modelName as string
        const temperature      = nodeData.inputs?.temperature as string
        const maxTokens        = nodeData.inputs?.maxTokens as string
        const topP             = nodeData.inputs?.topP as string
        const frequencyPenalty = nodeData.inputs?.frequencyPenalty as string
        const stop             = nodeData.inputs?.stop as string
        const timeout          = nodeData.inputs?.timeout as string

        const obj: Partial<OpenAIChatInput> & { openAIApiKey?: string } = {
            temperature: parseFloat(temperature ?? '0'),
            modelName,
            openAIApiKey
        }

        if (maxTokens)        obj.maxTokens        = parseInt(maxTokens, 10)
        if (topP)             obj.topP             = parseFloat(topP)
        if (frequencyPenalty) obj.frequencyPenalty = parseFloat(frequencyPenalty)
        if (stop)             obj.stop             = [stop]
        if (timeout)          obj.timeout          = parseInt(timeout, 10)

        const model = new ChatOpenAI(obj, { basePath })
        return model
    }
}

module.exports = { nodeClass: ChatNodeRED_ChatModels }
