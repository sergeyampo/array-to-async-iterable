const {setTimeout: setTimeoutPromise} = require('node:timers/promises');

const DEFAULT_INTERVAL = 500;

class AsyncTimeIterator {
    #arrayRef = [];

    constructor(array, ms = DEFAULT_INTERVAL) {
        this.#arrayRef = array;
        this._interval = ms;
    }

    [Symbol.asyncIterator]() {
        let time = Date.now();
        let i = 0;
        const interval = this._interval;
        return {
            next: () => {
                const now = Date.now();
                const diff = now - time;
                if (diff > interval) {
                    time = now;
                    return setTimeoutPromise(0).then(() => ({
                        value: this.#arrayRef[i],
                        done: i++ === this.#arrayRef.length
                    }));
                }
                return Promise.resolve({
                    value: this.#arrayRef[i],
                    done: i++ === this.#arrayRef.length
                });
            }
        };
    }
}

module.exports = AsyncTimeIterator;
