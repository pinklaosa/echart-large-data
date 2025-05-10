import { useState, useLayoutEffect, useRef, useCallback } from "react";
import ReactECharts from "echarts-for-react";
import * as Comlink from 'comlink';
import { generateTimeSeriesData, generateRandomWalkData } from "../utils/datapoints";

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
        const count = 1000000;
        const dates = generateTimeSeriesData(count);
        const keys = Array.from(selectedRows);
        
        // Generate data in chunks to prevent UI blocking
        const chunkSize = 100000;
        const chunks = Math.ceil(count / chunkSize);
        
        // Initialize empty arrays for each key
        const allValues = keys.map(() => []);
        
        // Process data in chunks
        for (let i = 0; i < chunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, count);
            
            // Generate chunk of data for each key
            const chunkData = await Promise.all(keys.map(async () => {
                const data = generateRandomWalkData(end - start, 1, 0, 100);
                return data.map(item => item.data1);
            }));
            
            // Append chunk data to main arrays
            chunkData.forEach((data, index) => {
                allValues[index].push(...data);
            });
            
            // Update progress
            const progress = Math.round((i + 1) / chunks * 100);
            chartInstance.setOption({
                title: {
                    text: `Loading data... ${progress}%`,
                    left: 'center'
                }
            });
        }

        // Process data in worker
        const dataset = await workerAPIRef.current.mergeDataPoints(dates, allValues, keys);
        datasetRef.current = dataset;
        
        // Update chart with optimized settings
        chartInstance.setOption({
          title: { text: "Price History", left: "center" },
          tooltip: { 
            trigger: "axis",
           
          },
          legend: { 
            data: keys.map((key) => `Coin ${key}`), 
            bottom: 0,
            selected: {}, 
          },
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
                return value.split('-').slice(1).join('-');
              },
              interval: Math.floor(count / 10) // Show fewer labels
            },
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
          progressive: 1000,
          progressiveThreshold: 5000,
          series: keys.map((key) => ({
            type: "line",
            name: `Coin ${key}`,
            encode: { x: 'timestamp', y: key },
            sampling: 'lttb',
            large: true,
            largeThreshold: 1000,
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 1
            }
          }))
        }, true);
        
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
      new URL('../workers/worker-comlink.js', import.meta.url), 
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
