import { View, Text } from '@react-pdf/renderer';
import { styles } from '../styles';

interface EnvironmentalImpactProps {
  environmental: {
    treesPlanted: number;
    carbonOffset: number;
    homesPowered: number;
  };
}

export const EnvironmentalImpact = ({ environmental }: EnvironmentalImpactProps) => (
  <View style={styles.section}>
    <Text style={styles.subheading}>Environmental Impact</Text>
    <View style={styles.grid}>
      <View style={styles.card}>
        <Text style={styles.text}>Equivalent Trees Planted</Text>
        <Text style={styles.highlight}>
          {environmental.treesPlanted.toLocaleString()}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.text}>Carbon Offset</Text>
        <Text style={styles.highlight}>
          {environmental.carbonOffset.toFixed(1)} tons/year
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.text}>Homes Powered</Text>
        <Text style={styles.highlight}>
          {environmental.homesPowered.toFixed(1)}
        </Text>
      </View>
    </View>
  </View>
);