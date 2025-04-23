import workerpool from "workerpool";

// Merge date objects with multiple series values, returning objects: {timestamp, [key]: value,...}
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

// Register worker functions
workerpool.worker({
    mergeDataPoints // Export the actual function
});