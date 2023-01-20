![Workflow](https://github.com/sergeyampo/array-to-async-iterable/actions/workflows/npm-publish.yml/badge.svg)

# array-to-async-iterable
This tiny package with zero-dependencies, typescript .d.ts coverage, full ESM and CJS compatibility helps you to iterate over large collections in **Node.js** truly asynchronously.

# What does it mean "truly asynchronously"?
In brief, if you were interested how libuv's event loop works you might notice that there are abstractions like microtasks and macrotasks in addition to well-known phases.
Server-side event loop has a large amount of tasks and events in each of the phases and execution shouldn't stay in one phase too much time. Obviously, you should use async-iterable contracts but what about arrays:

So, this is a simple example represents why can't just we use **for-await-of** to array and why the event loop will be blocked:
```js
describe(`Simple for-await-of loop`, async () => {
    it(`for-await-of loop blocks timers execution`, async () => {
        const arr = new Array(1e6).fill(0);
        const tickEveryMs = 10;
        let timerCounter = 0;
        let lastCounterValue = timerCounter;
        let elTicksCounter = 0;
        
        //This timer's callback attempts to increment timerCounter every 10ms. 
        const timer = setInterval(() => ++timerCounter, tickEveryMs);
        //It seems we won't block the event loop and timer should work
        for await(const c of arr) {
            //We check did the timer's callback increase the value
            if (timerCounter > lastCounterValue) {
                ++elTicksCounter;
                lastCounterValue = timerCounter;
            }
        }
        clearInterval(timer);
        //So this test is passed. All of the timers in the process were blocked during the iteration. 
        assert.strictEqual(elTicksCounter, 0)
    });
});
```
Event loop couldn't execute timers and go to the next phase until all of microtasks were completed. 


# How to use it
It's incredibly easy to iterate truly asynchronously:
```js
//import { AsyncTimeIterator } from 'array-to-async-iterable' for ESM or
//const { AsyncTimeIterator } = require('array-to-async-iterable');

for await(const element of new AsyncTimeIterator(array)){
    //...
}
```
1. By default, every 500 ms we coerce event loop to enter new phase and unblocks the event loop.
2. Also, you can pass your own time to control this process:
```js
for await(const element of new AsyncTimeIterator(array, 100)){ //Unblocks the event loop every 100ms.
    //...
}
```
It's recommended for an array to be large and have simple operations in a loop.
You won't get much profit using small arrays for extremely long operations.


Inspired by [@metarhia](https://github.com/HowProgrammingWorks).
