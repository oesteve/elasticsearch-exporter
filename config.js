import {program} from "commander";


let now = new Date();
let atFormatted = now.toLocaleString();

// 12 AM on June 20, 2022
const onHourBefore = new Date();
onHourBefore.setHours(onHourBefore.getHours() - 1);
const untilFormatted = onHourBefore.toLocaleString()

const defaultPageSize = 5000;

program
    .name('elasticsearch-exporter')
    .description('ElasticSearch export tool')
    .version('0.8.0')
    .requiredOption('-i, --index <index>', 'index to search')
    .requiredOption('-q --query <query>', 'the ElasticSearch query string, https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax')
    .option('-h, --host <host>', 'ElasticSearch URL', 'https://127.0.0.1:9200')
    .option('-f, --fields <fields...>', 'fields to export in the .csv file')
    .option('-ps, --pageSize <pageSize>', 'search page size', defaultPageSize.toString())
    .option('-a, --at <at>', 'the at date', atFormatted)
    .option('-u, --until <until>', 'until', untilFormatted)
    .option('-d, --debug', 'enable debug mode', false)
    .option('-tf, --timeField <timeField>', 'sort time field', 'takeOn')
    .option('-fs, --fileSize <fileSize>', 'max number of lines per file')
    .option('-l, --limit <limit>', 'max result size');

program.parse();

const optionValues = program.opts();

if (optionValues.debug) {
    console.log('Config:', optionValues);
}

export const getConfig = () => {

    return optionValues;
}

