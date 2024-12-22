import { generateBaseTemplate } from './templates/base/layout';
import { generateHeader } from './templates/sections/header';
import { generatePropertyAnalysis } from './templates/sections/propertyAnalysis';
import { generateSystemSpecs } from './templates/sections/systemSpecs';
import { generateFinancialAnalysis } from './templates/sections/financialAnalysis';
import { generateROITimeline } from './templates/sections/roiTimeline';
import { generateEnvironmentalImpact } from './templates/sections/environmentalImpact';
import { generateNextSteps } from './templates/sections/nextSteps';

export const generateReport = (data: any): string => {
    const template = generateBaseTemplate()
        .replace('{{header}}', generateHeader(data))
        .replace('{{propertyAnalysis}}', generatePropertyAnalysis(data))
        .replace('{{systemSpecs}}', generateSystemSpecs(data))
        .replace('{{financialAnalysis}}', generateFinancialAnalysis(data))
        .replace('{{roiTimeline}}', generateROITimeline(data))
        .replace('{{environmentalImpact}}', generateEnvironmentalImpact(data))
        .replace('{{nextSteps}}', generateNextSteps());

    return template;
};