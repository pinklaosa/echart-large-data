// Simple worker file
import workerpool from 'workerpool';

// Create a simple processor
function process(data) {
    console.log('Worker processing:', data);
    return data;
}

// Register worker functions
workerpool.worker({
    process
});