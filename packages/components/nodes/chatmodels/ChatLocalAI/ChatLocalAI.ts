import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { ChatOpenAI, OpenAIChatInput } from 'langchain/chat_models/openai'

class ChatLocalAI_ChatModels implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'ChatLocalAI'
        this.name  = 'chatLocalAI'
        this.type  = 'ChatLocalAI'
        this.icon  = 'localai.png'
        this.category = 'Chat Models'
        this.description = 'Use local LLMs like llama.cpp, gpt4all using LocalAI'
        this.baseClasses = [this.type, ...getBaseClasses(ChatOpenAI)]
        this.inputs = [
            {
                label: 'Base Path',
                name: 'basePath',
                type: 'string',
                placeholder: 'http://localhost:8080/v1',
                description: 'base URL of LocalAI server'
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
                label: 'Presence Penalty',
                name: 'presencePenalty',
                type: 'number',
                default:0,
                optional: true,
                additionalParams: true,
                description: 'presence penalty (-2...2)'
            },
            {
                label: 'Stop Sequence',
                name: 'stop',
                type: 'string',
                default: '### Instruction:',
                additionalParams: true,
                description: 'sequence at which to stop token generation'
            },
            {
                label: 'Streaming Mode',
                name: 'streaming',
                type: 'boolean',
                default: true,
                additionalParams: true,
                description: 'stream partial results or wait for final result?'
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
        const modelName        = nodeData.inputs?.modelName as string
        const temperature      = nodeData.inputs?.temperature as string
        const maxTokens        = nodeData.inputs?.maxTokens as string
        const topP             = nodeData.inputs?.topP as string
        const frequencyPenalty = nodeData.inputs?.frequencyPenalty as string
        const presencePenalty  = nodeData.inputs?.presencePenalty as string
        const stop             = nodeData.inputs?.stop as string
        const streaming        = nodeData.inputs?.streaming as boolean
        const timeout          = nodeData.inputs?.timeout as string

        const obj: Partial<OpenAIChatInput> & { openAIApiKey?: string } = {
            temperature: parseFloat(temperature ?? '0'),
            modelName,
            openAIApiKey:'sk-xxxx',                              // just a dummy
            streaming:streaming ?? true
        }

        if (maxTokens)        obj.maxTokens        = parseInt(maxTokens, 10)
        if (topP)             obj.topP             = parseFloat(topP)
        if (frequencyPenalty) obj.frequencyPenalty = parseFloat(frequencyPenalty)
        if (presencePenalty)  obj.presencePenalty  = parseFloat(presencePenalty)
        if (stop)             obj.stop             = [stop]
        if (timeout)          obj.timeout          = parseInt(timeout, 10)

        const model = new ChatOpenAI(obj, { basePath })
        return model
    }
}

module.exports = { nodeClass: ChatLocalAI_ChatModels }
