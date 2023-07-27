import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { OpenAI, OpenAIInput } from 'langchain/llms/openai'

class NodeRED_LLMs implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'NodeRED'
        this.name  = 'nodeRED'
        this.type  = 'NodeRED'
        this.icon  = 'node-red-icon.png'
        this.category = 'LLMs'
        this.description = 'uses LM Studio Server Mode instead of OpenAI'
        this.baseClasses = [this.type, ...getBaseClasses(OpenAI)]
        this.inputs = [
            {
                label: 'Base Path',
                name: 'basePath',
                type: 'string',
                default: 'http://localhost:8000/v1',
                description: 'base URL of LM Studio Server'
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
                additionalParams: true,
                description: 'sequence at which to stop token generation'
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
        const stop             = nodeData.inputs?.stop as string
        const timeout          = nodeData.inputs?.timeout as string

        const obj: Partial<OpenAIInput> & { openAIApiKey?: string } = {
            temperature: parseFloat(temperature ?? '0'),
            modelName,
            openAIApiKey:'sk-xxxx'                               // just a dummy
        }

        if (maxTokens)        obj.maxTokens        = parseInt(maxTokens, 10)
        if (topP)             obj.topP             = parseFloat(topP)
        if (frequencyPenalty) obj.frequencyPenalty = parseFloat(frequencyPenalty)
        if (stop)             obj.stop             = [stop]
        if (timeout)          obj.timeout          = parseInt(timeout, 10)

        const model = new OpenAI(obj, { basePath })
        return model
    }
}

module.exports = { nodeClass: NodeRED_LLMs }
