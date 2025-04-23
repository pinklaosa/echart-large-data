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

export {
    randomNumber,
    generateRandomData,
    generateTimeSeriesData,
    generateScatterData,
    generatePieData
};