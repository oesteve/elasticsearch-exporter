import {program} from "commander";

const fifteenMinutesBefore = new Date();
fifteenMinutesBefore.setMinutes(fifteenMinutesBefore.getMinutes() - 15);
const startDate = fifteenMinutesBefore.toISOString()

let now = new Date();
let endDate = now.toISOString();

const defaultPageSize = 5000;

program
    .name('elasticsearch-exporter')
    .description('ElasticSearch export tool')
    .version('0.8.0')
    .requiredOption('-i, --index <index>', 'index to search')
    .requiredOption('-q --query <query...>', 'Match queries eg: "foo:bar"')
    .option('-h, --host <host>', 'ElasticSearch URL', 'https://127.0.0.1:9200')
    .option('-f, --fields <fields...>', 'fields to export in the .csv file')
    .option('-ps, --pageSize <pageSize>', 'search page size', defaultPageSize.toString())
    .option('-s, --start <at>', 'the at date', startDate)
    .option('-e, --end <until>', 'until', endDate)
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

