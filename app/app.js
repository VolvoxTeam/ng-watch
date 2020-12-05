'use strict';
const { VolvoxMapping } = require('./utils/mapping');
const { VolvoxLog } = require('./utils/log');
const log = new VolvoxLog();
const volvoxMappings = new VolvoxMapping(`${ __dirname }/mappings/mappings.json`);

const express = require('express');
const app = express();

app.use(express.static(`${__dirname}/dist`));

app.use(express.json());

volvoxMappings.init();

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/dist`);
});

/**
 * Get all mappings
 */
app.get('/api/mappings', (req, res) => {
    res.json(volvoxMappings.data);
});

/**
 * Add a new mapping
 */
app.post('/api/mappings', (req, res) => {
    volvoxMappings.add(req.body);
    res.json(req.body);
});

/**
 * Update an existing mapping
 */
app.patch('/api/mappings', (req, res) => {
    volvoxMappings.update(req.body);
    res.json(req.body);
});

/**
 * Delete a mapping
 */
app.delete('/api/mappings/:mappingId', (req, res) => {
    volvoxMappings.delete(req.params.mappingId);
    res.json(req.params.mappingId);
});

/**
 * Get last copied date
 */
app.get('/api/copy/last-synced', (req, res) => {
    res.json(volvoxMappings.lastSynced);
});

/**
 * Copies source from mapping to target
 */
app.post('/api/copy', (req, res) => {
    if (!req.body) {
        log.error('No data given');
        return;
    }
    volvoxMappings.copy(req.body.mapping, (err) => {
        if (err) {
            res.statusCode = 400;
            res.json({ message: 'Directory not found' });
        } else {
            if (req.body.watch) {
                volvoxMappings.watch(req.body.mapping);
            }
            res.json(volvoxMappings.lastSynced);
        }
    });
});


app.listen('8080');
log.info('Backend running on http://localhost:8080/');