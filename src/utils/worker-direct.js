// Standard Web Worker
self.addEventListener('message', function(e) {
    const { type, data } = e.data;

    if (type === 'process') {
        // Just return the data for testing
        self.postMessage({ result: data });
    } else if (type === 'mergeData') {
        const { dates, allValues, keys } = data;

        // Process the data
        const result = dates.map((item, idx) => {
            const entry = { timestamp: item.date };
            keys.forEach((key, i) => {
                const values = allValues[i] || [];
                entry[key] = values[idx] != null ? values[idx] : 0;
            });
            return entry;
        });

        // Send back the result
        self.postMessage({ result });
    }
});