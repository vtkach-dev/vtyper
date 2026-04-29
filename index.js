import express from 'express';
import { join } from "path";
import { readFileSync, readdirSync } from 'fs';
import choice from "./funcs.js";

const basePath = import.meta.dirname

const words_en = readFileSync(join('words_en.txt')).toString()
const words_ru = readFileSync(join('words_ru.txt')).toString()

let sentences_ru = readFileSync(join('sentences_ru.txt')).toString()
let sentences_en = readFileSync(join('sentences_en.txt')).toString()


let sentencesEnNumbers = readFileSync(join('sentences_en_numbers.txt')).toString()
let sentencesRuNumbers = readFileSync(join('sentences_ru_numbers.txt')).toString()

let desktopLayoutsSetRU = []
let desktopLayoutsDirRu = join('static', 'desktop', 'layouts', 'ru')

let desktopLayoutsSetEN = []
let desktopLayoutsDirEN = join('static', 'desktop', 'layouts', 'en')


let mobileLayoutsSetRU = []
let mobileLayoutsDirRu = join('static', 'mobile', 'layouts', 'ru')

let mobileLayoutsSetEN = []
let mobileLayoutsDirEN = join('static', 'mobile', 'layouts', 'en')

for (let i of readdirSync(desktopLayoutsDirRu)) {
    desktopLayoutsSetRU.push(readFileSync(join(desktopLayoutsDirRu, i)).toString())
}

for (let i of readdirSync(desktopLayoutsDirEN)) {
    desktopLayoutsSetEN.push(readFileSync(join(desktopLayoutsDirEN, i)).toString())
}


for (let i of readdirSync(mobileLayoutsDirRu)) {
    mobileLayoutsSetRU.push(readFileSync(join(mobileLayoutsDirRu, i)).toString())
}

for (let i of readdirSync(mobileLayoutsDirEN)) {
    mobileLayoutsSetEN.push(readFileSync(join(mobileLayoutsDirEN, i)).toString())
}


const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
];

const innerIp = '192.168.0.108';
const outerIp = '94.181.46.30';
const domain = 'vtyper.ru';
const protocol = 'http'
const port = 80

const base = `${protocol}://${domain}`

function checkDeviceType(headers) {
    /* не знаю, почему, но оно иногда вылетает с ошибкой, для
    этого здесь стоит обработчик ошибок */

    let deviceType;

    try {
        deviceType = toMatch.some((toMatchItem) => {
            return headers['user-agent'].match(toMatchItem);
        }) ? 'mobile' : 'desktop'; //'mobile' : 'desktop' потом вернуть
    } catch {
        deviceType = 'desktop'
    }

    return deviceType;
}

const app = express();

app.get('/', (req, res) => {
    let deviceType;

    deviceType = checkDeviceType(req.headers)    

    res.sendFile(join(basePath, 'static', `${deviceType}`, `${deviceType}.html`))
})

app.get('/api/words', (req, res) => {
    let searchParams = new URL(`${base}/${req.url}`).searchParams

    let quantity = searchParams.get('quantity') || 10;
    let lang = searchParams.get('lang') || 'en';

    if (quantity > 10_000) {
        quantity = 10
    }

    let responseText;

    if (lang == 'en') {
        responseText = JSON.stringify(choice(words_en, quantity).join(' '))
    } else {
        responseText = JSON.stringify(choice(words_ru, quantity).join(' '))
    }

    res.end(responseText.replace(/"/g, ''))
})

app.get('/api/sentences', (req, res) => {
    let searchParams = new URL(`${base}/${req.url}`).searchParams

    let quantity = searchParams.get('quantity') || 3
    let pmarks = searchParams.get('pmarks') == '1'
    let incNumbers = searchParams.get('incNumbers') == '1'
    let lang = searchParams.get('lang') || 'en'

    if (quantity > 1_000) {
        quantity = 1_000
    }

    let rawData;

    if (incNumbers) {
        if (lang == 'en') {
            rawData = choice(sentencesEnNumbers, quantity)
        } else {
            rawData = choice(sentencesRuNumbers, quantity)
        }

    } else {
        if (lang == 'en') {
            rawData = choice(sentences_en, quantity)
        } else {
            rawData = choice(sentences_ru, quantity)
        }
    }

    rawData = rawData.map(e => e + ' ')

    rawData = rawData.toString()
    .replace(/\.\s,/g, '. ')
    .replace(/ ,/g, '')
    .replace(/’/gi, "'")


    if (!pmarks) {
        rawData = rawData
        .replace(/\s-\s/gi, ' ')
        .replace(/\."/gi, ' ')
        .replace(/\?/gi, ' ')
        .replace(/[!"';:?/,-.]/g, '')
    }   

    if (rawData.endsWith(' ')) {
        res.end(rawData.slice(0, rawData.length - 1))
    } else {
        res.end(rawData)
    }
})

app.get('/api/layouts', (req, res) => {
    let lang = new URL(`${base}/${req.url}`).searchParams.get('lang') || 'en'
    
    let deviceType = checkDeviceType(req.headers);

    if (lang == 'en') {
        if (deviceType == 'desktop') {
            res.send(JSON.stringify(desktopLayoutsSetEN))
        } else {
            res.send(JSON.stringify(mobileLayoutsSetEN))
        }
    } else {
        if (deviceType == 'desktop') {
            res.send(JSON.stringify(desktopLayoutsSetRU))
        } else {
            res.send(JSON.stringify(mobileLayoutsSetRU))
        }
    }

})

app.use('/static', express.static('static'))

app.listen(port, '', (error) => {
    if (error) {
        console.error(error)
        return;
    }

    console.log(`Server running at ${base}:${port}`)
})

