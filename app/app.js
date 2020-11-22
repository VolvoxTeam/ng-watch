'use strict';
const { VolvoxMapping } = require('./utils/mapping');
const { VolvoxQuestion } = require('./utils/question');
const { VolvoxLog } = require('./utils/log');
const log = new VolvoxLog();
const question = new VolvoxQuestion();
const volvoxMappings = new VolvoxMapping(`${ __dirname }/mappings/mappings.json`);

/**
 * Menu items
 * @type {({name: string, action: Function}|{name: string, action: Function})[]}
 */
const menu = [
    {
        name: 'Create mapping',
        action: () => updateMapping(null, true),
    },
    {
        name: 'Edit mapping',
        action: () => {
            const mappings = volvoxMappings.data.mappings;
            log.list(mappings.map(val => val.name), '%d.');
            editMapping(mappings);
        },
    },
    {
        name: 'Delete mapping',
        action: () => {
            const mappings = volvoxMappings.data.mappings;
            log.list(mappings.map(val => val.name), '%d.');
            deleteMapping(mappings);
        },
    },
    {
        name: 'Sync',
        action: () => {
            const mappings = volvoxMappings.data.mappings;
            log.list(mappings.map(val => val.name), '%d.');
            syncMap(mappings);
        },
    },
    {
        name: 'Sync & Watch',
        action: () => {
            const mappings = volvoxMappings.data.mappings;
            log.list(mappings.map(val => val.name), '%d.');
            syncMap(mappings, true);
        },
    },
];


// Mapping
volvoxMappings.init();
displayMenu();

function validateNumber(number, min, max) {
    number = +number;

    // check if input is number
    if (!number) {
        log.error('Input is not a number');
        return false;
    }

    // Check if number is out of range
    if (number < min || number > max) {
        log.error('Input is out of range...');
        return false;
    }

    return true;
}

function mergeQuestion(question, oldValue) {
    if (oldValue) {
        question += ` (${ oldValue })`;
    }
    return question + ': ';
}

//#region Menu
function displayMenu() {
    log.clear();
    log.info(`Choose action (1-${ menu.length })`, true);
    log.list(menu.map((val) => val.name), '%d.');
    chooseMenu();
}

function chooseMenu() {
    question.create(`Choose an action (1-${ menu.length }): `, (result) => {
        if (!validateNumber(result, 1, menu.length)) {
            chooseMenu();
            return;
        }

        // Menu item was in range
        log.clear();
        const menuItem = menu[+result - 1];
        log.info(menuItem.name, true);
        menuItem.action();
    });
}

//#endregion

//#region Actions
// Update mapping
function updateMapping(index, create) {
    let mapping = { name: '', source: '', target: '' };
    if (index >= 0) {
        mapping = { ...volvoxMappings.data.mappings[index] };
    }

    question.create(mergeQuestion('Enter source', mapping.source), (source) => {
        if (source) {
            mapping.source = source;
        }
        question.create(mergeQuestion('Enter target', mapping.target), (target) => {
            if (target) {
                mapping.target = target;
            }
            question.create(mergeQuestion('Enter name', mapping.name), (name) => {
                if (name) {
                    mapping.name = name;
                }

                if (create) {
                    volvoxMappings.add(mapping);
                } else {
                    volvoxMappings.update(index, mapping);
                }
                displayMenu();
            });
        });
    });
}

// Edit mapping
function editMapping(mappings) {
    question.create('Select a mapping: ', (result) => {
        if (!validateNumber(result, 1, mappings.length)) {
            editMapping(mappings);
            return;
        }

        updateMapping(+result - 1);
    });
}

// Delete a mapping
function deleteMapping(mappings) {
    question.create('Select a mapping: ', (result) => {
        if (!validateNumber(result, 1, mappings.length)) {
            deleteMapping(mappings);
            return;
        }

        volvoxMappings.delete(+result - 1);
        displayMenu();
    });
}

function syncMap(mappings, watch) {
    question.create('Select a mapping: ', (result) => {
        if (!validateNumber(result, 1, mappings.length)) {
            syncMap(mappings, watch);
            return;
        }

        volvoxMappings.copy(mappings[+result - 1], true, () => {
            if (watch) {
                volvoxMappings.watch(mappings[+result - 1])
                question.close();
            }
        });
    });
}

//#endregion