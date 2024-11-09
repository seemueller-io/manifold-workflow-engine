#!/usr/bin/env node

import {
  DummyLlmService,
  ManifoldRegion,
  WorkflowFunctionManifold,
  WorkflowOperator,
} from './lib.js';

async function demonstrateManifold() {
  // Initialize services and manifold
  const llm = new DummyLlmService();
  const manifold = new WorkflowFunctionManifold(llm);

  // Create operators
  const dataAnalysisOp = new WorkflowOperator('analysis', async state => {
    console.log('Performing data analysis...');
    return { ...state, analyzed: true };
  });

  const dataProcessingOp = new WorkflowOperator('processing', async state => {
    console.log('Processing data...');
    return { ...state, processed: true };
  });

  const dataTransformOp = new WorkflowOperator('transformation', async state => {
    console.log('Transforming data...');
    return { ...state, transformed: true };
  });

  // Create regions
  const analysisRegion = new ManifoldRegion('analysis', [dataAnalysisOp]);
  const processingRegion = new ManifoldRegion('processing', [dataProcessingOp]);
  const transformationRegion = new ManifoldRegion('transformation', [dataTransformOp]);

  // Connect regions
  analysisRegion.connectTo(processingRegion);
  processingRegion.connectTo(transformationRegion);

  // Add regions to manifold
  manifold.addRegion(analysisRegion);
  manifold.addRegion(processingRegion);
  manifold.addRegion(transformationRegion);

  // Demonstrate workflow execution
  console.log('Starting workflow demonstration...');

  const prompts = ['analyze the data', 'process the results', 'transform the output'];

  for (const prompt of prompts) {
    console.log(`\nExecuting prompt: "${prompt}"`);
    await manifold.navigate(prompt);
    const executed = await manifold.executeWorkflow(prompt);
    console.log('Current state:', manifold.state);
    console.log(`Current region: ${manifold.currentRegion.name}`);
    console.log(`Operation executed: ${executed}`);
  }
}

// Run the demonstration
demonstrateManifold().catch(console.error);

export {};
