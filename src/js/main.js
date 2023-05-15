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
    },
    content: {
        daysContainer: document.querySelector('.habbits'),
        nextDay: document.querySelector('main .habbit .habbit__day')
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
    page.header.h1.innerText = activeHabbit.name;
    const progress = activeHabbit.days.length / activeHabbit.target > 1
        ? 100
        : activeHabbit.days.length / activeHabbit.target * 100;

    page.header.progressPercent.innerText = progress.toFixed(0) + '%';
    page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`)
}

function rerenderContent(activeHabbit) {
    page.content.daysContainer.innerHTML = '';
    for (const index in activeHabbit.days) {
        const element = document.createElement('li');
        element.classList.add('habbit');
        element.innerHTML = `<div class="habbit__day">День ${Number(index) + 1}</div>
        <div class="habbit__body">
        <div class="habbit__comment">${activeHabbit.days[index].comment}</div>
      <button class="habbit__delete">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 6V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V6M15 6V5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5V6M4 6H20M10 10V16M14 10V16"
            stroke="#94A3BD"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
        </div>`;
        page.content.daysContainer.appendChild(element);
        page.content.nextDay.innerText = `День ${activeHabbit.days.length + 1}`;
    }
}

function rerender(activeHabbitId) {
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    if (!activeHabbit) {
        return
    }
    rerenderMenu(activeHabbit);
    rerenderHeader(activeHabbit);
    rerenderContent(activeHabbit);
}

//Immediately Invoked Function Expression(IIFE) for init
(() => {
    loadData();
    rerender(1)
})();