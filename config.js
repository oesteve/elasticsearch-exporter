import {program} from "commander";


let now = new Date();
let atFormatted = now.toLocaleString();

// 12 AM on June 20, 2022
const onHourBefore = new Date();
onHourBefore.setHours(onHourBefore.getHours() - 1);
const untilFormatted = onHourBefore.toLocaleString()

const defaultPageSize = 1000;

program
    .name('string-util')
    .description('CLI to some JavaScript string utilities')
    .version('0.8.0')
    .requiredOption('-i, --index <index>', 'Index to search')
    .requiredOption('-q --query <query>', 'The ElasticSearch query string, https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax')
    .option('-h, --host <host>', 'ElasticSearch URL', 'https://127.0.0.1:9200')
    .option('-f, --fields <fields...>', 'specify fields')
    .option('-ps, --pageSize <pageSize>', 'Search page size', defaultPageSize.toString())
    .option('-a, --at <at>', 'The at date', atFormatted)
    .option('-u, --until <until>', 'Until', untilFormatted)
    .option('-d, --debug', 'Enable debug mode', false)
    .option('-tf, --timeField <timeField>', 'Sort time field', 'takeOn')
    .option('-fs, --fileSize <fileSize>', 'Max number of lines per file', (5 * defaultPageSize).toString())
    .option('-l, --limit <limit>', 'Max result size');

program.parse();

const optionValues = program.opts();

if(optionValues.debug){
    console.log('Config:', optionValues);
}

export const getConfig = () => {

    return optionValues;
}

