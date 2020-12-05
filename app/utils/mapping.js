const fs = require('fs');
const chokidar = require('chokidar');
const { ncp } = require('ncp');
const { VolvoxLog } = require('./log');
const log = new VolvoxLog();

class VolvoxMapping {

    constructor(path) {
        this.path = path;
        this.copying = false;
        this.copyAfterFinish = false;
        this.watcher = null;
    }

    init() {
        this.data = [];
        fs.readFile(this.path, (err, data) => {
            if (err) {
                // User has no mappings
                this.save();
            }

            this.data = JSON.parse(data.toString().trim());
        });
    }

    add(mapping) {
        if (!mapping) {
            log.error('No mapping given');
            return;
        }

        const mapData = [ ...this.data ];
        mapping.id = mapData.length + 1;
        mapData.push(mapping);
        this.data = mapData;
        this.save();
    }

    update(mapping) {
        if (!mapping) {
            log.error('No mapping given');
            return;
        }

        const mapData = [ ...this.data ];
        const index = mapData.findIndex((val) => val.id === mapping.id);
        if (index !== -1) {
            mapData[index] = mapping;
            this.data = mapData;
            this.save();
        } else {
            log.error('No mapping found');
        }
    }

    delete(mappingId) {
        const mapData = [ ...this.data ];
        const index = mapData.findIndex((val) => val.id === mappingId);
        mapData.splice(index, 1);
        this.data = mapData;
        this.save();
    }

    watch(mapping) {
        this.watcher = chokidar.watch(mapping.source, { ignored: /^\./, persistent: true });
        log.info('Watching for file changes...');

        this.watcher
            .on('add', () => {
                // this.copy(mapping);
            })
            .on('change', () => {
                // this.copy(mapping);
            })
            .on('unlink', () => {
                // this.copy(mapping);
            })
            .on('error', (error) => {
                log.error(error.message);
            });
    }

    unwatch() {
        this.watcher.close();
    }

    copy(mapping, onCopied) {
        // TODO: Check for __ivy_ngcc__

        if (this.copying) {
            this.copyAfterFinish = true;
            return;
        }

        ncp.limit = 0;
        log.process(`Copying...`);
        this.copying = true;
        ncp(mapping.source, mapping.target, (err) => {
            if (err) {
                log.error(err);
            }

            if (this.copyAfterFinish) {
                this.copyAfterFinish = false;
                this.copy(mapping);
            }

            log.success('Done.');

            if (onCopied) {
                onCopied(err);
            }
            this.copying = false;
        });
    }

    save() {
        fs.writeFile(this.path, JSON.stringify(this.data), () => {
        });
    }

    set data(value) {
        this.mapData = value;
    }

    get data() {
        return this.mapData;
    }
}

module.exports.VolvoxMapping = VolvoxMapping;