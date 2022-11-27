#!/usr/bin/env node
import {fileNumber, writePage} from "./writer.js";
import {countResults, read} from "./reader.js";
import cliProgress from "cli-progress";
import {getMemoryUsage} from "./process.js";

try {
    const payload = () => ({ memory: getMemoryUsage(), files: fileNumber + 1 });
    const progressBar = new cliProgress.SingleBar({
        format: '[{bar}] {percentage}% | Duration: {duration_formatted} | ETA: {eta_formatted} | {value}/{total} | {memory} | Files: {files}'
    }, cliProgress.Presets.shades_classic);

    const total = await countResults();
    
    progressBar.start(total, 0, payload());

    await read((pageData) => {
        progressBar.increment(pageData.length, payload())
        writePage(pageData)
    })

    progressBar.stop();
    console.log("\n\rExport process success!")

} catch (err) {
    console.error("Error:", err.message)
}
