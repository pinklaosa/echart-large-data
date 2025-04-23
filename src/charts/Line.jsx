import { useState, useLayoutEffect, useRef, useCallback } from "react";
import ReactECharts from "echarts-for-react";
import * as Comlink from 'comlink';
import { generateTimeSeriesData, generateRandomData } from "../utils/datapoints";

const Line = ({ selectedRows }) => {
  const chartRef = useRef(null);
  const workerRef = useRef(null);
  const workerAPIRef = useRef(null);
  const datasetRef = useRef(null);
  
  // Get chart instance - memoized for performance
  const getChartInstance = useCallback(() => {
    return chartRef.current?.getEchartsInstance();
  }, []);
  
  // Handle chart data update without full component re-render
  const updateChartData = useCallback(async () => {
    const chartInstance = getChartInstance();
    if (!chartInstance) return;
    
    try {
      // If we have selected rows & worker is ready, process data
      if (selectedRows.size > 0 && workerAPIRef.current) {
        // Show loading state
        chartInstance.showLoading();
        
        const count = 10000;
        const dates = generateTimeSeriesData(count);
        const keys = Array.from(selectedRows);
        const allValues = keys.map(() => generateRandomData(count));
        
        // Process data in worker
        const dataset = await workerAPIRef.current.mergeDataPoints(dates, allValues, keys);
        datasetRef.current = dataset;
        
        // Update chart directly without state change
        chartInstance.setOption({
          title: { text: "Price History", left: "center" },
          tooltip: { 
            trigger: "axis",
           
          },
          legend: { 
            data: keys.map((key) => `Coin ${key}`), 
            bottom: 0,
            selected: {}, // Auto-select all by default
          },
          // Optimize for large datasets
          animation: false,
          dataset: { 
            source: dataset,
            dimensions: ['timestamp', ...keys],
          },
          xAxis: { 
            type: "category", 
            name: "timestamp",
            scale: true,
            axisLabel: {
              formatter: (value) => {
                // Simplified date display for performance
                return value.split('-').slice(1).join('-');
              }
            },
            // Optimize for performance
            axisPointer: {
              snap: false,
              label: {
                formatter: (params) => {
                  return params.value;
                }
              }
            }
          },
          yAxis: { 
            type: "value",
            scale: true,
          },
          // Enable data zoom for large datasets
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100
            },
            {
              type: 'slider',
              start: 0,
              end: 100
            }
          ],
          // Enable progressive rendering for large datasets
          progressive: 500,
          progressiveThreshold: 3000,
          // Faster rendering
          series: keys.map((key) => ({
            type: "line",
            name: `Coin ${key}`,
            encode: { x: 'timestamp', y: key },
            sampling: 'lttb', // Large Time Series Sampling
            large: true,
            largeThreshold: 500,
            smooth: true,
            showSymbol: false,
          }))
        }, true); // True parameter preserves other options
        
        // Hide loading state
        chartInstance.hideLoading();
      } else if (selectedRows.size === 0) {
        // No coins selected - show empty state
        chartInstance.setOption({
          title: {
            text: 'Select cryptocurrencies to view price history',
            left: 'center',
            top: 'center',
            textStyle: {
              color: '#999',
              fontSize: 16
            }
          },
          xAxis: { show: false },
          yAxis: { show: false },
          series: []
        });
      }
    } catch (error) {
      console.error('Error updating chart:', error);
      chartInstance.hideLoading();
    }
  }, [selectedRows, getChartInstance]);

  // Initialize worker and chart once
  useLayoutEffect(() => {
    // Create and wrap worker with Comlink
    const worker = new Worker(
      new URL('../utils/worker-comlink.js', import.meta.url), 
      { type: 'module' }
    );
    const workerAPI = Comlink.wrap(worker);
    
    // Store references
    workerRef.current = worker;
    workerAPIRef.current = workerAPI;
    
    // Test worker connection
    workerAPI.ping().then(result => {
      console.log('Worker ready:', result);
    });
    
    // Clean up on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
        workerAPIRef.current = null;
      }
    };
  }, []);
  
  // Update chart when selection changes
  useLayoutEffect(() => {
    updateChartData();
  }, [selectedRows, updateChartData]);
  
  // Chart events config
  const onChartEvents = {
    // Optimize chart after render
    'rendered': () => {
      const chartInstance = getChartInstance();
      if (chartInstance) chartInstance.hideLoading();
    }
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <ReactECharts
        ref={chartRef}
        option={{}} // Empty initial options, will set via instance
        style={{ height: "100%" }}
        opts={{ renderer: "canvas" }}
        onEvents={onChartEvents}
        lazyUpdate={true}
        notMerge={false}
      />
    </div>
  );
};

export default Line;
