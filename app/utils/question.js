const readLine = require('readline');
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

class VolvoxQuestion {

    /**
     *
     * @param {string} question
     * @param {Function} callback
     */
    create(question, callback) {
        rl.question(question, callback);
    }

    close() {
        rl.close();
    }
}

module.exports.VolvoxQuestion = VolvoxQuestion;