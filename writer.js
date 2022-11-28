import fs from 'fs'
import path from 'path'
import {getConfig} from "./config.js";

const EOL = "\r\n";
const SEPARATOR = ';';

const outputDir = 'out';
const fileNamePrefix = 'output';

const {fileSize, limit} = getConfig();

let lastFileName;
export let wroteLines = 0;
export let fileNumber = 0;

export function writePage(pageData){
    const fileName = creteOrGetFilename(pageData);

    pageData.forEach((rows) => {
        
        if(wroteLines >= limit) {
            return;
        }
        
        wroteLines++

        let line = Object.values(rows).join(SEPARATOR);
        fs.appendFileSync(fileName, line + EOL);
    })

}

function creteOrGetFilename(pageData){
    let fileName = fileNamePrefix;
    const header = Object.keys(pageData[0]).join(SEPARATOR) + EOL
    
    if(fileSize){
        fileNumber = Math.floor(wroteLines / fileSize);
    }
    
    if(fileNumber !== 0){
        fileName += '_'+fileNumber
    }

    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
    }
    
    fileName += '.csv';
    fileName = path.resolve(outputDir, fileName);

    if (wroteLines === 0) {
        cleanPreviousFiles()
    }
    
    if(lastFileName !== fileName){
        fs.writeFileSync(fileName, header);
        lastFileName = fileName
    }
    
    return fileName;
}

function cleanPreviousFiles(){
    const regex = new RegExp(`${fileNamePrefix}.*\.csv`)
    fs.readdirSync(outputDir)
        .filter(f => regex.test(f))
        .map(f => fs.unlinkSync(path.resolve(outputDir, f)))
}
