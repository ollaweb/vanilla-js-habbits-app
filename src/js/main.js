import '@/scss/main.scss'

'use strict'

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';
let globalActiveHabbitId;

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
    },
    popup: {
        index: document.querySelector('.cover'),
        form: document.querySelector('.popup__form')
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

function validateFormAndGetData(form, fields) {
    const formData = new FormData(form);
    const res = {};
    let isValid = true;
    for (const field of fields) {
        const fieldValue = formData.get(field).trim();
        form[field].classList.remove('error');
        if (!fieldValue) {
            form[field].classList.add('error');
            resetForm(form, [field])
        }
        res[field] = fieldValue;
    }
    for (const field of fields) {
        if (!res[field]) {
            isValid = false;
        }
    }
    if (!isValid) {
        return;
    }
    return res;
}

function resetForm(form, fields) {
    for (const field of fields) {
        form[field].value = '';
    }
}

//toggle Popup
function togglePopup() {
    if (page.popup.index.classList.contains('active')) {
        page.popup.index.classList.remove('active');
        return;
    }
    page.popup.index.classList.add('active');
}

window.togglePopup = togglePopup;

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
      <button class="habbit__delete" onclick="deleteDay(${index})">
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
    }
    page.content.nextDay.innerText = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId) {
    globalActiveHabbitId = activeHabbitId;
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    if (!activeHabbit) {
        return
    }
    rerenderMenu(activeHabbit);
    rerenderHeader(activeHabbit);
    rerenderContent(activeHabbit);
}

//work with days
const habbitForm = document.querySelector('.habbit__form')
habbitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = validateFormAndGetData(event.target, ['comment']);
    if (!data) {
        return;
    }
    habbits = habbits.map(habbit => {
        if (habbit.id === globalActiveHabbitId) {
            return {
                ...habbit,
                days: habbit.days.concat([{ comment: data.comment }])
            }
        }
        return habbit;
    });
    resetForm(event.target, ['comment']);
    rerender(globalActiveHabbitId);
    saveData();
});

//delete day with comment
function deleteDay(index) {
    habbits = habbits.map(habbit => {
        if (habbit.id === globalActiveHabbitId) {
            habbit.days.splice(index, 1);
            return {
                ...habbit,
                days: habbit.days
            };
        }
        return habbit;
    });
    rerender(globalActiveHabbitId);
    saveData();
}

window.deleteDay = deleteDay;

//add habbit
function addHabbit(event) {
    event.preventDefault();
    const data = validateFormAndGetData(event.target, ['name', 'icon', 'target']);
    if (!data) {
        return;
    }
    const maxId = habbits.reduce((acc, habbit) => acc > habbit.id ? acc : habbit.id, 0)
    habbits.push({
        id: maxId + 1,
        name: data.name,
        target: data.target,
        icon: data.icon,
        days: []
    });
    resetForm(event.target, ['name', 'icon', 'target']);
    togglePopup();
    saveData();
    rerender(maxId + 1);
}

window.addHabbit = addHabbit;

//work with popup
function setIcon(context, iconName) {
    page.popup.form['icon'].value = iconName;
    const activeIcon = document.querySelector('.popup__icon-select button.active');
    activeIcon.classList.remove('active');
    context.classList.add('active');
}

window.setIcon = setIcon;

habbitForm['comment'].addEventListener('focus', () => {
    habbitForm['comment'].classList.remove('error');
});

//Immediately Invoked Function Expression(IIFE) for init
(() => {
    loadData();
    rerender(1);
})();