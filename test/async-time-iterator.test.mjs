import {describe, it} from 'node:test';
import {AsyncTimeIterator} from "../index.mjs";
import assert from "node:assert";

describe(`Loops built from AsyncTimeIterator`, async () => {
    it(`for-await-of loop doesn't block timers execution`, async () => {
        const arr = new Array(1e6).fill(0);
        const tickEveryMs = 10;
        let timerCounter = 0;
        let lastCounterValue = timerCounter;
        let elTicksCounter = 0;

        const timer = setInterval(() => ++timerCounter, tickEveryMs);
        for await(const c of new AsyncTimeIterator(arr, tickEveryMs)) {
            if (timerCounter > lastCounterValue) {
                ++elTicksCounter;
                lastCounterValue = timerCounter;
            }
        }
        clearInterval(timer);
        assert.strictEqual(elTicksCounter > 0, true)
    });
});

describe(`Simple for-await-of loop`, async () => {
    it(`for-await-of loop blocks timers execution`, async () => {
        const arr = new Array(1e6).fill(0);
        const tickEveryMs = 10;
        let timerCounter = 0;
        let lastCounterValue = timerCounter;
        let elTicksCounter = 0;

        const timer = setInterval(() => ++timerCounter, tickEveryMs);
        for await(const c of arr) {
            if (timerCounter > lastCounterValue) {
                ++elTicksCounter;
                lastCounterValue = timerCounter;
            }
        }
        clearInterval(timer);
        assert.strictEqual(elTicksCounter, 0)
    });
});
