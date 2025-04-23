import * as Comlink from 'comlink';

// Import the function from the original module if it exists
// import { mergeDataPoints } from '../workers/merge_datapoints';

// Or recreate the function
const mergeDataPoints = (dates, allValues, keys) => {
    return dates.map((item, idx) => {
        const entry = { timestamp: item.date };
        keys.forEach((key, i) => {
            const values = allValues[i] || [];
            entry[key] = values[idx] != null ? values[idx] : 0;
        });
        return entry;
    });
};

// Object with functions to expose via Comlink
const api = {
    // Simple test function
    ping: () => "pong",

    // Actual data processing function
    mergeDataPoints
};

// Expose the API using Comlink
Comlink.expose(api);