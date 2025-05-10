// Generate a single random number between min and max
const randomNumber = (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate an array of random numbers
const generateRandomData = (count = 10, min = 0, max = 100) => {
    return Array.from({ length: count }, () => randomNumber(min, max));
};

// Generate time series data with timestamps
const generateTimeSeriesData = (count = 10) => {
    const now = new Date();
    return Array.from({ length: count }, (_, i) => {
        const date = new Date(now.getTime() - (count - i) * 24 * 60 * 60 * 1000);
        return {
            date: date.toISOString().split('T')[0],
        };
    });
};

// Generate scatter plot data points
const generateScatterData = (count = 10, min = 0, max = 100) => {
    return Array.from({ length: count }, () => [
        randomNumber(min, max),
        randomNumber(min, max)
    ]);
};

// Generate pie chart data
const generatePieData = (count = 5, min = 10, max = 100) => {
    return Array.from({ length: count }, (_, i) => ({
        name: `Category ${i + 1}`,
        value: randomNumber(min, max)
    }));
};

// Generate varied random data with different patterns
const generateVariedRandomData = (count = 10, min = 0, max = 100) => {
    // Randomly determine the trend type
    const trendType = Math.floor(Math.random() * 3); // 0: up, 1: down, 2: wave

    // Randomly determine the max point position
    const maxPointPosition = Math.floor(Math.random() * count);

    // Randomly determine the actual max value
    const actualMax = randomNumber(min + 50, maxPointPosition);

    return Array.from({ length: count }, (_, i) => {
        switch (trendType) {
            case 0: // Upward trend
                return Math.floor(min + (actualMax - min) * (i / count));
            case 1: // Downward trend
                return Math.floor(actualMax - (actualMax - min) * (i / count));
            case 2: // Wave trend
                return Math.floor(min + (actualMax - min) * (0.5 + 0.5 * Math.sin(i * Math.PI / 4)));
            default:
                return randomNumber(min, actualMax);
        }
    });
};

// Generate random walk data with multiple series
const generateRandomWalkData = (count = 10, seriesCount = 3, min = 0, max = 100) => {
    const dataset = [];
    // Initialize starting values for each series
    const values = Array.from({ length: seriesCount }, () => randomNumber(min, max));
    const baseTime = new Date().getTime();

    for (let i = 0; i < count; i++) {
        // Update each series with random walk
        const newValues = values.map(value => {
            // Add random change between -5 and 5
            const change = (Math.random() - 0.5) * 10;
            // Ensure the new value stays within bounds
            return Math.max(min, Math.min(max, value + change));
        });

        // Update the values array
        values.forEach((_, index) => {
            values[index] = newValues[index];
        });

        // Create data point with timestamp
        const timestamp = baseTime + i * 1000;
        const dataPoint = {
            timestamp: timestamp,
            ...Object.fromEntries(
                newValues.map((value, index) => [`data${index + 1}`, Math.round(value)])
            )
        };
        dataset.push(dataPoint);
    }
    return dataset;
};

export {
    randomNumber,
    generateRandomData,
    generateTimeSeriesData,
    generateScatterData,
    generatePieData,
    generateVariedRandomData,
    generateRandomWalkData
};