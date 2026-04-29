let cachedLayouts = {}

function renderLayout(element, layoutName, lang) {  
    element.innerHTML = ''
    element.insertAdjacentHTML('afterbegin', cachedLayouts[lang][layoutName])

    if (layoutName == 'words-tab') {
        let wordsQuantity = document.getElementsByName('words-quantity')

        for (let e of wordsQuantity) {                 
            e.onclick = function () {
                this
                .parentElement
                .parentElement
                .parentElement
                .parentElement
                .children[1]
                .children[0]
                .value = ''
            }
            
        }

        document.getElementById('words-q-custom').onclick = function() {
            for (let e of wordsQuantity) {
                e.checked = false
            }
        }

        
    } else if (layoutName == 'numbers-tab') {
        let numbersQuantity = document.getElementsByName('numbers-quantity')
        let numbersMl = document.getElementsByName('numbers-ml')

        for (let e of numbersQuantity) {
            e.onclick = function () {
                this
                .parentElement
                .parentElement
                .children[1]
                .value = ''
            }
        }

        for (let e of numbersMl) {
            e.onclick = function () {
                this
                .parentElement
                .parentElement
                .children[1]
                .value = ''
            }
        }
        
        document.getElementById('numbers-q-custom').onclick = function() {
            for (let e of numbersQuantity) {
                e.checked = false
            }
        }

        document.getElementById('numbers-ml-custom').onclick = function() {
            for (let e of numbersMl) {
                e.checked = false
            }
        }
    } else {
        let sentencesQuantity = document.getElementsByName('sentences-quantity')

        for (let e of sentencesQuantity) {
            e.onclick = function () {
                this
                .parentElement
                .parentElement
                .children[1]
                .value = ''
            }
        }

        document.getElementById('sentences-q-custom').onclick = function() {
            for (let e of sentencesQuantity) {
                e.checked = false;
            }
        }
    }
}