const Colors = {
    Reset: '\x1b[0m',
    Bright: '\x1b[1m',
    Dim: '\x1b[2m',
    Underscore: '\x1b[4m',
    Blink: '\x1b[5m',
    Reverse: '\x1b[7m',
    Hidden: '\x1b[8m',

    FgBlack: '\x1b[30m',
    FgRed: '\x1b[31m',
    FgGreen: '\x1b[32m',
    FgYellow: '\x1b[33m',
    FgBlue: '\x1b[34m',
    FgMagenta: '\x1b[35m',
    FgCyan: '\x1b[36m',
    FgWhite: '\x1b[37m',

    BgBlack: '\x1b[40m',
    BgRed: '\x1b[41m',
    BgGreen: '\x1b[42m',
    BgYellow: '\x1b[43m',
    BgBlue: '\x1b[44m',
    BgMagenta: '\x1b[45m',
    BgCyan: '\x1b[46m',
    BgWhite: '\x1b[47m',
};

class VolvoxLog {

    clear() {
        console.clear();
    }

    /**
     *
     * @param {string} message
     */
    error(message) {
        console.log(Colors.FgRed, `[ERROR] ${ message }`, Colors.FgWhite);
    }

    warning() {

    }

    /**
     *
     * @param {number} amount
     */
    lineBreaks(amount) {
        for (let i = 0; i < amount; i++) {
            console.log('\n');
        }
    }

    success(message) {
        console.log(Colors.FgGreen, `[SUCCESS] ${ message }`, Colors.FgWhite)
    }

    /**
     * List items
     * @param {string[]} items
     * @param {string} separator
     * @param {boolean} showBack
     */
    list(items, separator = '-') {
        for (let i = 0; i < items.length; i++) {
            let prefix = separator;
            if (separator.includes('%d')) {
                prefix = separator.replace(/%d/g, `${ i + 1 }`);
            }

            console.log(Colors.FgWhite, `${ prefix } ${ items[i] }`);
        }
    }

    /**
     *
     * @param {string} message The message to be send
     * @param {boolean} withHeaders show the headers
     */
    info(message, withHeaders = false) {
        let header = '';
        message = `${ message }`;
        if (withHeaders) {
            for (let i = 0; i < message.length + 10; i++) {
                header += '-';
            }
            console.log(Colors.FgCyan, header, Colors.FgWhite);
            message = `     ${ message }     `;
        }

        console.log(Colors.FgCyan, message, Colors.FgWhite);

        if (withHeaders) {
            console.log(Colors.FgCyan, header, Colors.FgWhite);
        }
    }

}

module.exports.VolvoxLog = VolvoxLog;
module.exports.Colors = Colors;