import '@/scss/main.scss'

'use strict'

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';

//page
const page = {
    menu: document.querySelector('.menu__list')
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

function rerender(activeHabbitId) {
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    rerenderMenu(activeHabbit);
}

//Immediately Invoked Function Expression(IIFE) for init
(() => {
    loadData();
    rerender(1)
})();