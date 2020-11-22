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
        this.data = {
            $schema: './schema.json',
            mappings: [
                {
                    source: null,
                    target: null,
                    name: null,
                },
            ],
        };
        this.data.mappings.splice(0, 1);
        this.read();
    }

    add(mapping) {
        const mapData = { ...this.data };
        mapData.mappings.push(mapping);
        this.data = mapData;
        this.save();
    }

    update(index, mapping) {
        const mapData = { ...this.data };
        mapData.mappings[index] = mapping;
        this.data = mapData;
        this.save();
    }

    delete(index) {
        const mapData = { ...this.data };
        mapData.mappings.splice(index, 1);
        this.data = mapData;
        this.save();
    }

    read() {
        fs.readFile(this.path, (err, data) => {
            if (err) {
                // User has no mappings
                this.save();
            }

            // User has mappings
            this.data = JSON.parse(data.toString());
        });
    }

    watch(mapping) {
        this.watcher = chokidar.watch(mapping.source, { ignored: /^\./, persistent: true });
        log.info('Watching for file changes...');

        this.watcher
            .on('add', () => {
                this.copy(mapping);
            })
            .on('change', () => {
                this.copy(mapping);
            })
            .on('unlink', () => {
                this.copy(mapping);
            })
            .on('error', (error) => {
                log.error(error.message);
            });
    }

    unwatch() {
        this.watcher.close();
    }

    copy(mapping, clear = false, onCopied) {
        if (clear) {
            log.clear();
        }

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

            if (onCopied) {
                onCopied();
            }

            if (this.copyAfterFinish) {
                this.copyAfterFinish = false;
                this.copy(mapping);
            }
            this.copying = false;
            log.success('Done.');
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