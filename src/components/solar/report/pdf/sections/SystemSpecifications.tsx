import { View, Text, Image } from '@react-pdf/renderer';
import { styles } from '../styles';

interface SystemSpecificationsProps {
  metrics: {
    panelCount: number;
    systemSize: number;
    annualProduction: number;
    carbonOffset: number;
  };
}

export const SystemSpecifications = ({ metrics }: SystemSpecificationsProps) => (
  <View style={styles.section}>
    <Text style={styles.subheading}>System Specifications</Text>
    <View style={styles.grid}>
      <View style={styles.card}>
        <Text style={styles.text}>Panel Count</Text>
        <Text style={styles.highlight}>{metrics.panelCount} panels</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.text}>System Size</Text>
        <Text style={styles.highlight}>{metrics.systemSize} kW</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.text}>Annual Production</Text>
        <Text style={styles.highlight}>{metrics.annualProduction.toLocaleString()} kWh</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.text}>Carbon Offset</Text>
        <Text style={styles.highlight}>{metrics.carbonOffset} tons/year</Text>
      </View>
    </View>
    <View style={{ marginTop: 15 }}>
      <Text style={styles.text}>Solar Exposure Analysis</Text>
      <Image 
        src="/placeholder-solar-analysis.png"
        style={{ width: '100%', height: 200, marginTop: 10 }}
      />
    </View>
  </View>
);