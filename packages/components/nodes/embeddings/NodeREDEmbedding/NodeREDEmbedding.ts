import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { OpenAIEmbeddings, OpenAIEmbeddingsParams } from 'langchain/embeddings/openai'

class NodeREDEmbedding_Embeddings implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'NodeRED Embeddings'
        this.name  = 'nodeREDEmbeddings'
        this.type  = 'NodeRED Embeddings'
        this.icon  = 'node-red-icon.png'
        this.category = 'Embeddings'
        this.description = 'use OpenAI-compatible Node-RED flows instead of OpenAI itself'
        this.baseClasses = [this.type, 'Embeddings']
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
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const basePath     = nodeData.inputs?.basePath as string
        const openAIApiKey = nodeData.inputs?.openAIApiKey as string
        const modelName    = nodeData.inputs?.modelName as string

        const obj: Partial<OpenAIEmbeddingsParams> & { openAIApiKey?: string } = {
            modelName,
            openAIApiKey
        }

        const model = new OpenAIEmbeddings(obj, { basePath })
        return model
    }
}

module.exports = { nodeClass: NodeREDEmbedding_Embeddings }
