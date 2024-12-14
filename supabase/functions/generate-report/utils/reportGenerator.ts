import OpenAI from "openai";
import { systemPrompts, tools } from "./agents";
import { generateReportHtml } from "./templates/mainTemplate";

const openai = new OpenAI();

export async function generateEnhancedReport(solarData: any, propertyAddress: string) {
  try {
    // Step 1: Process raw data
    const processedData = await processData(solarData);
    
    // Step 2: Analyze data
    const analysis = await analyzeData(processedData);
    
    // Step 3: Generate report content
    const reportContent = await generateContent(analysis);
    
    // Step 4: Generate final HTML
    return generateReportHtml({
      ...reportContent,
      propertyAddress,
      generatedDate: new Date().toLocaleDateString()
    });
  } catch (error) {
    console.error('Report generation error:', error);
    throw error;
  }
}

async function processData(rawData: any) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: [
      { role: "system", content: systemPrompts.dataProcessing },
      { role: "user", content: JSON.stringify(rawData) }
    ],
    tools: tools.dataProcessing,
    tool_choice: "auto"
  });

  return JSON.parse(response.choices[0].message.tool_calls![0].function.arguments);
}

async function analyzeData(processedData: any) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: [
      { role: "system", content: systemPrompts.analysis },
      { role: "user", content: JSON.stringify(processedData) }
    ],
    tools: tools.analysis,
    tool_choice: "auto"
  });

  return JSON.parse(response.choices[0].message.tool_calls![0].function.arguments);
}

async function generateContent(analysis: any) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: [
      { role: "system", content: systemPrompts.report },
      { role: "user", content: JSON.stringify(analysis) }
    ],
    tools: tools.report,
    tool_choice: "auto"
  });

  return JSON.parse(response.choices[0].message.tool_calls![0].function.arguments);
}