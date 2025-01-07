import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { HeaderSection } from './sections/HeaderSection';
import { SystemSpecifications } from './sections/SystemSpecifications';
import { FinancialAnalysis } from './sections/FinancialAnalysis';
import { EnvironmentalImpact } from './sections/EnvironmentalImpact';
import { MonthlyProduction } from './sections/MonthlyProduction';
import { styles } from './styles';

interface PDFDocumentProps {
  data: {
    property: {
      address: string;
      generatedDate: string;
    };
    systemMetrics: {
      panelCount: number;
      systemSize: number;
      annualProduction: number;
      carbonOffset: number;
    };
    financial: {
      systemCost: number;
      federalTaxCredit: number;
      netCost: number;
      paybackPeriod: number;
      monthlyLoanPayment?: number;
    };
    environmental: {
      treesPlanted: number;
      carbonOffset: number;
      homesPowered: number;
    };
  };
}

export const SolarPDFDocument = ({ data }: PDFDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <HeaderSection 
        address={data.property.address}
        date={data.property.generatedDate}
      />
      <SystemSpecifications metrics={data.systemMetrics} />
      <FinancialAnalysis financial={data.financial} />
      <EnvironmentalImpact environmental={data.environmental} />
      <MonthlyProduction />
    </Page>
  </Document>
);