import { ChatCompletionCreateParams } from "openai/resources/chat/completions";

export const systemPrompts = {
  dataProcessing: `You are a Data Processing Agent specialized in solar installation data. Your role is to:
- Clean and structure raw Google Solar API responses
- Extract key metrics and insights
- Format data for analysis
- Ensure all numerical values are properly normalized`,

  analysis: `You are a Solar Analysis Agent. Your role is to:
- Analyze solar potential data
- Calculate financial metrics and ROI
- Generate environmental impact statistics
- Provide insights on system efficiency`,

  report: `You are a Report Generation Agent specialized in creating solar installation reports. Your role is to:
- Generate natural language explanations of technical data
- Create engaging descriptions of solar benefits
- Structure information in a clear, professional format
- Highlight key insights and recommendations`
};

export const tools: Record<string, ChatCompletionCreateParams.Function[]> = {
  dataProcessing: [
    {
      name: "process_solar_data",
      description: "Process and structure raw solar API data",
      parameters: {
        type: "object",
        properties: {
          rawData: {
            type: "object",
            description: "Raw Google Solar API response"
          }
        },
        required: ["rawData"]
      }
    }
  ],
  analysis: [
    {
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
  ],
  report: [
    {
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
  ]
};