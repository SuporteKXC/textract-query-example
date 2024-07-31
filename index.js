import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract"; // ES Modules import
import { readFile, writeFile } from 'fs/promises'
const client = new TextractClient();


const document = await readFile('./cnh6.pdf')


const input = { // AnalyzeDocumentRequest
  Document: { // Document
    Bytes: document,
    // "S3Object": {
    //     "Bucket": "textract-console-us-east-1-c4b07f2c-0179-4c54-9937-7ce8cab3e5a6",
    //     "Name": "427cc2dc_5c76_42ba_a966_30ec5c713001_cnh6.pdf"
    // }
  },    
  FeatureTypes: [ // FeatureTypes // required
   "QUERIES"
  ],
  "QueriesConfig": {
    "Queries": [
            {
                "Text": "Qual o nome?",
                "Pages": [
                    "1"
                ]
            },
            {
                "Text": "Qual a data de emissao?",
                "Pages": [
                    "1"
                ]
            },
            {
                "Text": "Qual a data de nascimento?",
                "Pages": [
                    "1"
                ]
            },
            {
                "Text": "Qual o numero da CNH?",
                "Pages": [
                    "1"
                ]
            },
            {
                "Text": "Qual a data de validade da CNH?",
                "Pages": [
                    "1"
                ]
            },
            {
                "Text": "Qual a data da primeira CNH?",
                "Pages": [
                    "1"
                ]
            },
            {
                "Text": "Qual a data de expedicao?",
                "Pages": [
                    "1"
                ]
            },
            {
                "Text": "Qual a categoria?",
                "Pages": [
                    "1"
                ]
            },
            {
                "Text": "Qual o CPF?",
                "Pages": [
                    "1"
                ]
            },
            {
                "Text": "Qual o numero do RG?",
                "Pages": [
                    "1"
                ]
            },
            {
                "Text": "Qual o nome da mae?",
                "Pages": [
                    "1"
                ]
            },
            {
                "Text": "Qual o nome do pai?",
                "Pages": [
                    "1"
                ]
            }
    ]
    },
    "AdaptersConfig": {
        "Adapters": [
            {
                "AdapterId": "078479ecb4b9",
                "Version": "2",
                "Pages": [
                    "*"
                ]
            }
        ]
    },
};
const command = new AnalyzeDocumentCommand(input);

const response = await client.send(command);

await writeFile('./output.json', JSON.stringify(response.Blocks))

const queries = response.Blocks.filter(b => b.BlockType === 'QUERY')
const queryResults = response.Blocks.filter(b => b.BlockType === 'QUERY_RESULT')

const form = {}

for(const query of queries){
    const resultId = query.Relationships[0].Ids[0]

    const result = queryResults.find(qr=> qr.Id == resultId)
    form[query.Query.Text] =  result.Text
}

await writeFile('./form.json', JSON.stringify(form))
