import OpenAI from "https://esm.sh/openai@4.28.0";
import { systemPrompts, tools } from "./agents.ts";
import { generateReportHtml } from "./templates/mainTemplate.ts";

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
    tools: [{
      type: "function",
      function: {
        name: "process_solar_data",
        description: "Process and structure raw solar API data",
        parameters: {
          type: "object",
          properties: {
            solarData: {
              type: "object",
              description: "Raw solar calculation data"
            }
          },
          required: ["solarData"]
        }
      }
    }],
    tool_choice: { type: "function", function: { name: "process_solar_data" } }
  });

  const toolCall = response.choices[0].message.tool_calls?.[0];
  return toolCall ? JSON.parse(toolCall.function.arguments) : null;
}

async function analyzeData(processedData: any) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: [
      { role: "system", content: systemPrompts.analysis },
      { role: "user", content: JSON.stringify(processedData) }
    ],
    tools: [{
      type: "function",
      function: {
        name: "analyze_solar_potential",
        description: "Analyze solar installation potential and benefits",
        parameters: {
          type: "object",
          properties: {
            processedData: {
              type: "object",
              description: "Processed solar data"
            }
          },
          required: ["processedData"]
        }
      }
    }],
    tool_choice: { type: "function", function: { name: "analyze_solar_potential" } }
  });

  const toolCall = response.choices[0].message.tool_calls?.[0];
  return toolCall ? JSON.parse(toolCall.function.arguments) : null;
}

async function generateContent(analysis: any) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: [
      { role: "system", content: systemPrompts.report },
      { role: "user", content: JSON.stringify(analysis) }
    ],
    tools: [{
      type: "function",
      function: {
        name: "generate_report_sections",
        description: "Generate report sections with natural language",
        parameters: {
          type: "object",
          properties: {
            analysis: {
              type: "object",
              description: "Analyzed solar data and insights"
            }
          },
          required: ["analysis"]
        }
      }
    }],
    tool_choice: { type: "function", function: { name: "generate_report_sections" } }
  });

  const toolCall = response.choices[0].message.tool_calls?.[0];
  return toolCall ? JSON.parse(toolCall.function.arguments) : null;
}