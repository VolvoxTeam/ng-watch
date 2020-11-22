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
        const watcher = chokidar.watch(mapping.source, { ignored: /^\./, persistent: true });
        log.info('Watching for file changes...');

        watcher
            .on('add', () => {
                log.info('File has been added');
                this.copy(mapping);
            })
            .on('change', () => {
                log.info('File has been changed');
                this.copy(mapping);
            })
            .on('unlink', () => {
                log.info('File has been removed');
                this.copy(mapping);
            })
            .on('error', (error) => {
                log.info('Got an error:');
                log.error(error.message);
            });
    }

    copy(mapping, clear = false, onCopied) {
        if (clear) {
            log.clear();
        }

        if (this.copying) {
            log.info('Waiting for copy to finish...');
            this.copyAfterFinish = true;
            return;
        }

        ncp.limit = 0;
        log.info(`Start copy`);
        this.copying = true;
        ncp(mapping.source, mapping.target, (err) => {
            this.copying = false;

            if (err) {
                log.error(err);
            }

            if (onCopied) {
                onCopied();
            }

            if (this.copyAfterFinish) {
                this.copyAfterFinish = false;
                this.copy(mapping, false);
            }
            log.success('done.');
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