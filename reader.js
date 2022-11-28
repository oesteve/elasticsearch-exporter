import {Client} from "@opensearch-project/opensearch";
import {getConfig} from "./config.js";

const {host, index, pageSize, limit, start, end, fields, debug, query, timeField} = getConfig()

const client = new Client({
    node: host,
    ssl: {
        rejectUnauthorized: false
    }
})

function buildQuery() {
    const startMillis = new Date(start).getTime()
    const endMillis = new Date(end).getTime();
    
    const should = query.map(term => {
        const [key, value] = term.split(':')
        
        return {
            match: {
                [key]: value
            }
        }
    })

    return {
        bool: {
            filter: [{
                bool: {
                    should
                },
            }, {
                range: {
                    [timeField]: {
                        "lt": endMillis,
                        "gte": startMillis
                    }
                }
            }]
        }
    };
}

function processHits(hits) {
    const pageData = [];
    hits.forEach(hit => {
        const rows = hit._source || {};
        if (fields) {
            fields.forEach(field => {
                let fieldValue = "";

                if (hit.fields[field] && hit.fields[field].length) {
                    fieldValue = hit.fields[field][0];
                }
                rows[field] = fieldValue
            })
        }

        pageData.push(rows);
    })

    return pageData
}

export const countResults = async () => {
    let searchParams = {
        index,
        body: {
            query: buildQuery(),
        }
    };

    if (debug) {
        console.log("ES Query:", JSON.stringify(searchParams, null, 4))
    }

    let res = await client.count(searchParams);
    return res.body.count

}

export const read = async (onNewPage) => {

    let searchParams = {
        index,
        body: {
            query: buildQuery(),
            _source: fields === undefined,
            fields,
            sort: {
                [timeField]: {
                    "order": "desc"
                }
            }
        },
        size: pageSize
    };

    if (debug) {
        console.log("\n\r ES Query:", JSON.stringify(searchParams, null, 4))
    }

    let itemsCount = 0;
    let sort;

    while (true) {
        if (sort) {
            searchParams = {
                ...searchParams,
                body: {
                    ...searchParams.body,
                    search_after: sort,
                }
            };
        }

        let res = await client.search(searchParams);
        let hits = res.body.hits.hits;

        // Break if the las result don't have more results 
        if (hits.length === 0) {
            break;
        }

        // Define the last item sort for the next page
        sort = hits[hits.length - 1].sort;
        itemsCount += hits.length
        const pageData = processHits(hits);
        onNewPage(pageData)

        if (itemsCount < limit) {
            break;
        }
    }
}
