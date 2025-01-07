import { View, Text, Image } from '@react-pdf/renderer';
import { styles } from '../styles';

export const MonthlyProduction = () => (
  <View style={styles.section}>
    <Text style={styles.subheading}>Monthly Solar Production</Text>
    <View style={{ marginTop: 10 }}>
      <Text style={styles.text}>Monthly Flux Analysis</Text>
      <View style={styles.grid}>
        {Array.from({ length: 12 }).map((_, index) => (
          <View key={index} style={{ width: '23%', marginBottom: 10 }}>
            <Image
              src={`/placeholder-month-${index + 1}.png`}
              style={{ width: '100%', height: 100 }}
            />
            <Text style={[styles.text, { textAlign: 'center' }]}>
              {new Date(2024, index).toLocaleString('default', { month: 'short' })}
            </Text>
          </View>
        ))}
      </View>
    </View>
  </View>
);