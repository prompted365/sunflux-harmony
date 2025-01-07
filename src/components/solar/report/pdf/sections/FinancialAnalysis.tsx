import { View, Text } from '@react-pdf/renderer';
import { styles } from '../styles';

interface FinancialAnalysisProps {
  financial: {
    systemCost: number;
    federalTaxCredit: number;
    netCost: number;
    paybackPeriod: number;
    monthlyLoanPayment?: number;
  };
}

export const FinancialAnalysis = ({ financial }: FinancialAnalysisProps) => (
  <View style={styles.section}>
    <Text style={styles.subheading}>Financial Analysis</Text>
    <View style={styles.grid}>
      <View style={styles.card}>
        <Text style={styles.text}>System Cost</Text>
        <Text style={styles.highlight}>
          ${financial.systemCost.toLocaleString()}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.text}>Federal Tax Credit</Text>
        <Text style={styles.highlight}>
          -${financial.federalTaxCredit.toLocaleString()}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.text}>Net Cost</Text>
        <Text style={styles.highlight}>
          ${financial.netCost.toLocaleString()}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.text}>Payback Period</Text>
        <Text style={styles.highlight}>
          {financial.paybackPeriod.toFixed(1)} years
        </Text>
      </View>
    </View>
  </View>
);