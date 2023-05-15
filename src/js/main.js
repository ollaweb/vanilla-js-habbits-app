import '@/scss/main.scss'

'use strict'

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';

//page
const page = {
    menu: document.querySelector('.menu__list'),
    header: {
        h1: document.querySelector('.header h1'),
        progressPercent: document.querySelector('.progress__percent'),
        progressCoverBar: document.querySelector('.progress__cover-bar')
    }
}

//utils
function loadData() {
    const habbitString = localStorage.getItem(HABBIT_KEY);
    const habbitArray = JSON.parse(habbitString);
    if (Array.isArray(habbitArray)) {
        habbits = habbitArray;
    }
}

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

//render
function rerenderMenu(activeHabbit) {
    if (!activeHabbit) {
        return;
    }
    for (const habbit of habbits) {
        const existedHabbit = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
        if (!existedHabbit) {
            //create it
            const element = document.createElement('button');
            element.setAttribute('menu-habbit-id', habbit.id);
            element.innerHTML = `<img src="/public/images/${habbit.icon}.svg" alt="${habbit.name}" />`;

            element.addEventListener('click', () => rerender(habbit.id));

            if (habbit.id === activeHabbit.id) {
                element.classList.add('active');
            }
            page.menu.appendChild(element);

            continue;
        }
        if (habbit.id === activeHabbit.id) {
            existedHabbit.classList.add('active');
        } else {
            existedHabbit.classList.remove('active');
        }
    }
}

function rerenderHeader(activeHabbit) {
    if (!activeHabbit) {
        return;
    }
    page.header.h1.innerText = activeHabbit.name;
    const progress = activeHabbit.days.length / activeHabbit.target > 1
        ? 100
        : activeHabbit.days.length / activeHabbit.target * 100;

    page.header.progressPercent.innerText = progress.toFixed(0) + '%';
    page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`)
}

function rerender(activeHabbitId) {
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    rerenderMenu(activeHabbit);
    rerenderHeader(activeHabbit);
}

//Immediately Invoked Function Expression(IIFE) for init
(() => {
    loadData();
    rerender(1)
})();