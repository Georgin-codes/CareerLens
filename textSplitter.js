import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";


export async function createChunk(pdf, jobDesc){
    const textSplitter = new RecursiveCharacterTextSplitter({chunkSize:150, chunkOverlap:15})
    const pdfChunks = await textSplitter.createDocuments([pdf])
    const jobDescChunks = await textSplitter.createDocuments([jobDesc])

    console.log(pdfChunks)
    console.log(jobDescChunks)
    return pdfChunks, jobDescChunks

}
