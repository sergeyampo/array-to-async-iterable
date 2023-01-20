export declare class AsyncTimeIterator{
    /**
     * @param array Iterable contract.
     * @param ms Give a quantum of time to the event loop every n milliseconds.
     */
    constructor<T>(array: Array<T>, ms?: number);
}
