class styleScheme {
    constructor(element, styles) {
        this.element = element,
            this.styles = styles
    }

    setStyle(id, element = this.element) {
        let styles = this.styles[id];

        for (let style in styles) {
            element.style[style] = styles[style];
        }
    }
}

class classScheme {
    constructor(element, classes) {
        this.element = element,
            this.classes = classes
    }

    setClassName(id, element = this.element) {
        element.className = this.classes[id]
    }

    addClassName(id, element = this.element) {
        element.className += (' ' + this.classes[id])
    }
}


const textWrapper = new styleScheme(document.getElementById('text-wrapper'),
    [
        { 'transform': 'scale(1.2) translateY(15%)' },
        { 'transform': 'scale(1)' },
    ])

const startOverlay = new styleScheme(document.getElementById('start-overlay'),
    [
        { 'display': 'none' },
        { 'display': 'flex' }
    ])

const endOverlay = new styleScheme(document.getElementById('end-overlay'),
    [
        { 'display': 'none' },
        { 'display': 'flex' }
    ])

const endStats = new styleScheme(document.getElementById('end-stats'),
    [
        { 'animation': 'none' },
        { 'animation': 'end 0.75s ease-out' },
        { 'animation': 'rend 0.3s ease-in' }
    ])
/*
const letterStyles = new styleScheme(null, [
    { 'color': '#fc0303' }, // red
    { 'color': '#63de4e' } // green
])
*/
const letterColors = new classScheme(null, [
    'wrong',
    'right'
])

const letterClassNames = new classScheme(null, [
    'letter-cursor-af',
    'letter-cursor-bf',
    ''
])

const header = new styleScheme(document.querySelector('header'),
    [
        { 'display': 'none' },
        { 'display': 'flex' }
    ])

const navElements = new styleScheme(null, [
    { 'transform': 'scale(1)' },
    { 'transform': 'scale(1.15)' }
])

const langButton = new styleScheme(document.getElementById('lang-button'),
    [
        { 'display': 'none' },
        { 'display': 'block' }
    ])

const fsContainer = new styleScheme(document.getElementById('fs-container'),
[
    { 'display': 'none' },
    { 'display': 'flex' }
])
