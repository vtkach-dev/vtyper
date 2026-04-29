const headerNav = document.getElementById('header-nav');
const elementInfo = document.getElementById('tab-content');
const statsField = document.getElementById('stats-field');
const textSection = document.getElementById('text');
const closeCross = document.getElementById('close-cross');
const startOverlayText = document.getElementById('start-overlay-text');
const wordsCustom = document.getElementById('words-q-custom');
const fontSizeCustom = document.getElementById('font-size-custom');
const fsCustomInput = document.getElementById('fs-custom-input');

function setTextFontSize(fontSize) {
    fsCustomInput.style.fontSize = `${fontSize}px`
    fsCustomInput.placeholder = `${langs[currLang]['font-size-custom']} (${fontSize}px)`
    fsCustomInput.value = ''

    textSection.style.fontSize = `${fontSize}px`
}


const headerNavList = headerNav.children

let typer = setTyperSkeleton()
let currLang = 'en'; // именно глобал, иначе скидываются настройки

let width = window.innerWidth;

if (width <= 1600) {
    setTextFontSize(20)
} else if (width > 1600 && width <= 1920) {
    setTextFontSize(25)
} else if (width > 1920 && width <= 2560) {
    setTextFontSize(38)
} else if (width > 2560 && width <= 3840) {
    setTextFontSize(50)
} else {
    setTextFontSize(100)
}

fontSizeCustom.onclick = function() {
    let element = this.parentElement.children[0]
    
    // let width = window.innerWidth

    /* fullhd - quadhd */
    /*
    if (width < 1920) {
        if (element.value > 25) {
            element.value = 25
        }
    } else if (width >= 1920 && width <= 2560) {
        if (element.value > 30) {
            element.value = 30            
        }
    } else if (width >= 2560) {
        if (element.value > 50) {
            element.value = 50
        }
    }
    */
    if (element.value < 12 && element.value != 0) {
        element.value = 12
    } else if (element.value == 0) {
        element.value = 25
    }

    typer.fontSize = element.value || 25

    setTextFontSize(typer.fontSize)
}

langButton.element.onclick = function() {
    let lastlang = currLang
    let newLang
    
    if (currLang == 'en') {
        newLang = 'ru'
    } else {
        newLang = 'en'
    }

    currLang = newLang;
    init();
    
    this.children[0].innerText = lastlang;
    document.title = langs[currLang]['title']

    this.blur()
}


function setTyperSkeleton() {
    return {
        text: '',
        state: -1,
        pointer: 0,
        letters: [],

        fontSize: 25,

        chunkClearQuantity: 3,

        chunkSize: 69 + 10,
        chunkCounter: 0,
        chunkClearCounter: 0,
        chunkClearId: 0,
        chunkId: 0,

        chunks: [],

        stats: {
            startTime: 0,
            deltaTime: 0,

            lettersNum: 0,
            wordsNum: 0,

            lettersCorrect: 0,
            lettersUncorrect: 0,
        }
    }
}

async function fetchWords() {
    let quantityElement = document.querySelector('input[name="words-quantity"]:checked')
    let customQEl = document.getElementById('words-q-custom')

    let quantityValue;

    if (customQEl.value) {
        quantityValue = customQEl.value
    } else {
        if (quantityElement) {
            quantityValue = quantityElement.value
        } else {
            quantityValue = 10
        }
    }


    fetch(`${window.location.href}api/words?quantity=${quantityValue}&lang=${currLang}`)
        .then(response => response.text())
        .then(data => {
            setText(data, quantityValue)
        })
}

function fetchNumbers() {
    let quantityElement = document.querySelector('input[name="numbers-quantity"]:checked')
    let customQElement = document.getElementById('numbers-q-custom')

    let quantityValue;

    let maxLengthElement = document.querySelector('input[name="numbers-ml"]:checked')
    let customMlElement = document.getElementById('numbers-ml-custom')

    let maxLengthValue;

    if (customQElement.value) {
        quantityValue = customQElement.value
    } else {
        if (quantityElement) {
            quantityValue = quantityElement.value
        } else {
            quantityValue = 10
        }
    }

    if (customMlElement.value) {
        maxLengthValue = customMlElement.value
    } else {
        if (maxLengthElement) {
            maxLengthValue = maxLengthElement.value
        } else {
            maxLengthValue = 3
        }
    }

    if (quantityValue > 10_000) {
        quantityValue = 10_000
    }

    if (maxLengthValue > 16) {
        maxLengthValue = 16
    }

    let result = []

    for (let i = 0; i < quantityValue; i++) {
        let randLen = Math.round(Math.random() * maxLengthValue)

        result.push(Math.round(Math.random() * 10 ** randLen))
    }

    result = result.join(' ')


    setText(result, quantityValue)
}

async function fetchSentences() {
    let pmarks = Number(document.getElementById('pmarks').checked)
    let incNumbers = Number(document.getElementById('include-numbers').checked)

    let quantityElement = document.querySelector('input[name="sentences-quantity"]:checked')
    let quantityValue;

    let customQEl = document.getElementById('sentences-q-custom')

    if (customQEl.value) {
        quantityValue = customQEl.value
    } else {
        if (quantityElement) {
            quantityValue = quantityElement.value
        } else {
            quantityValue = 10
        }
    }


    fetch(`${window.location.href}api/sentences?quantity=${quantityValue}&pmarks=${pmarks}&incNumbers=${incNumbers}&lang=${currLang}`)
        .then(response => response.text())
        .then(text => text.replace(/\\/gi, ''))
        .then(text => setText(text, text.split(' ').length))
}

function setText(text, numOfWords) {
    textSection.innerText = ""

    typer = setTyperSkeleton()

    typer.stats.wordsNum = numOfWords
    typer.stats.lettersNum = text.length
    typer.text = text
    typer.state = 0

    for (let i = 0; i < text.length / typer.chunkSize; i += 1) {
        let chunkData = '';
        let chunk;

        if ((text.length - i * typer.chunkSize) < typer.chunkSize) {
            chunk = text.slice(i * typer.chunkSize)
        } else {
            chunk = text.slice(i * typer.chunkSize, (i + 1) * typer.chunkSize)
        }

        for (let letter of chunk) {
            if (letter == ' ') {
                letter = '&nbsp;';
            }

            chunkData += `<letter>${letter}</letter>`;
        }

        typer.chunks.push({ 'chunk': chunkData, 'length': chunk.length, 'htmlSize': chunkData.length + chunk.length * 14 })
    }


    renderTextChunk(typer.chunkId)

    startOverlayText.innerText = langs[currLang]['start-overlay-ready']
}


function renderTextChunk(id, targetElement = textSection) {
    targetElement.insertAdjacentHTML("beforeend", typer.chunks[id]['chunk']);
    typer.letters = targetElement.children;
}

function init() {
    typer.state = -1

    for (let element of headerNavList) {
        navElements.setStyle(0, element)
    }

    if (!(currLang in cachedLayouts)) {
        fetch(`${window.location.href}api/layouts?lang=${currLang}`)
            .then(response => response.text())
            .then(text => JSON.parse(text))
            .then(data => {
                
                cachedLayouts[currLang] = {}

                cachedLayouts[currLang]['words-tab'] = data[0]
                cachedLayouts[currLang]['numbers-tab'] = data[1]
                cachedLayouts[currLang]['sentences-tab'] = data[2]

                renderLayout(elementInfo, headerNavList[0].id, currLang)
            })
    } else {
        renderLayout(elementInfo, headerNavList[0].id, currLang)
    }

    /*
    Мы повторяем 2 раза renderLayout(), потому что код ниже выполнится
    раньше, чем закончится промис. Из - за этого может сыпать ошибками
    */

    navElements.setStyle(1, headerNavList[0])

    startOverlayText.innerText = langs[currLang]['start-overlay-preparing']

    fsCustomInput.placeholder = `${langs[currLang]['font-size-custom']} (${typer.fontSize}px)`

    for (let children of headerNavList) {
        children.innerText = langs[currLang][children.id]
    }
    
    textSection.innerText = langs[currLang]['example-text']
}


init()

function generalKeyHandler(key) {
    if (typer.state == 0) {
        if (key == ' ') {
            typer.state = -1

            textWrapper.setStyle(0)
            header.setStyle(0)
            langButton.setStyle(0)
            fsContainer.setStyle(0)

            let i = 2

            startOverlayText.innerText = 3

            let timer = setInterval(() => {
                if (i >= 1) {
                    startOverlayText.innerText = i
                    i -= 1
                } else {
                    clearInterval(timer)
                    startOverlay.setStyle(0)
                    typer.state = 1
                    typer.stats.startTime = Date.now()
                }
            }, 1000);
        }
    } else if (typer.state == 1) {
        let currLetter = typer.letters[typer.pointer];
        let nextLetter = typer.letters[typer.pointer + 1];

        let isCorrect = key == typer.text[typer.pointer]

        if (isCorrect) {
            typer.stats.lettersCorrect += 1
        } else {
            typer.stats.lettersUncorrect += 1
        }


        letterColors.setClassName(Number(isCorrect), currLetter)

        typer.chunkCounter += 1

        if (typer.pointer == typer.text.length - 1) { // if text is finished
            letterClassNames.addClassName(0, currLetter)

            textWrapper.setStyle(1)
            endOverlay.setStyle(1)
            endStats.setStyle(1)

            typer.stats.deltaTime = Date.now() - typer.stats.startTime;

            let times = [
                String(Math.round(typer.stats.deltaTime / 60_000)),
                String(Math.floor(typer.stats.deltaTime / 1000)),
                String(typer.stats.deltaTime / 1000).split('.')[1]
            ]

            times = times.map(function (i) {
                return i.length >= 2 ?
                    i : '0'.repeat(2 - i.length) + i
            })

            typer.stats.accuracy = ((typer.stats.lettersCorrect / typer.stats.lettersNum) * 100).toFixed(1)
            typer.stats.wpm = ((60_000 / typer.stats.deltaTime) * typer.stats.wordsNum).toFixed(2)

            statsField.insertAdjacentHTML('afterbegin', `
            <li>${langs[currLang]['end-stats-time']}: ${times.join(':')}</li>
            <li>${langs[currLang]['end-stats-wpm']}: ${((60_000 / typer.stats.deltaTime) * typer.stats.wordsNum).toFixed(2)}</li>
            <li>${langs[currLang]['end-stats-accuracy']}: ${((typer.stats.lettersCorrect / typer.stats.lettersNum) * 100).toFixed(1)}%</li>
            <li>${langs[currLang]['end-stats-lettersCorrect']}: ${typer.stats.lettersCorrect}</li>
            <li>${langs[currLang]['end-stats-lettersUnCorrect']}: ${typer.stats.lettersUncorrect}</li>
            `)


            typer.state = -1
        } else {
            letterClassNames.setClassName(1, nextLetter)

            if (typer.chunkCounter == Math.round(typer.chunks[typer.chunkId]['length'] / 2) && typer.chunkId !== typer.chunks.length - 1) {

                renderTextChunk(typer.chunkId + 1)
            }


            if (typer.chunkCounter == typer.chunks[typer.chunkId]['length'] && typer.chunkId !== typer.chunks.length - 1) {
                typer.chunkClearCounter += 1

                typer.chunkId += 1
                typer.chunkCounter = 0

            }


            if (typer.chunkClearCounter == typer.chunkClearQuantity) {
                textSection.innerHTML = textSection.innerHTML.slice(typer.chunks[typer.chunkClearId]['htmlSize'])

                typer.chunkClearId += 1


                typer.text = typer.text.slice(typer.chunkSize)
                typer.letters = textSection.children
                typer.pointer -= typer.chunkSize


                typer.chunkClearQuantity = 1

                typer.chunkClearCounter = 0
            }
            
            typer.pointer += 1;
        }
    }
}
document.addEventListener('keypress', function (event) {
    generalKeyHandler(event.key)
});

headerNav.addEventListener('click', function (e) {
    let target = e.target
    
    if (target.className == 'nav-button') {       
        for (let element of headerNavList) {
            navElements.setStyle(0, element)
        }

        navElements.setStyle(1, target)


        renderLayout(elementInfo, target.id, currLang)

        startOverlayText.innerText = langs[currLang]['start-overlay-preparing']

        textSection.innerText = langs[currLang]['example-text']

        typer.state = -1
    }
})

endOverlay.element.addEventListener('click', function (event) {
    if (event.target == endOverlay.element || event.target == closeCross) {
        endStats.setStyle(2)

        textSection.innerText = ""

        endStats.element.onanimationend = () => {
            endStats.setStyle(0)
            endOverlay.setStyle(0)

            statsField.innerHTML = ""

            startOverlay.setStyle(1)

            startOverlayText.innerText = langs[currLang]['start-overlay-preparing']

            header.setStyle(1)
            langButton.setStyle(1)
            fsContainer.setStyle(1)

            renderLayout(elementInfo, headerNavList[0].id, currLang)

            textSection.innerText = langs[currLang]['example-text']

            endStats.element.onanimationend = () => { }
        }
    }
})
