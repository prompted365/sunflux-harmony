import { View, Text, Image } from '@react-pdf/renderer';
import { styles } from '../styles';

interface HeaderSectionProps {
  address: string;
  date: string;
}

export const HeaderSection = ({ address, date }: HeaderSectionProps) => (
  <View style={styles.section}>
    <Image 
      src="/lovable-uploads/b72825ac-f807-4e0e-8dd7-d11fa7046731.png"
      style={{ width: 120, marginBottom: 10 }}
    />
    <Text style={styles.heading}>Solar Installation Analysis</Text>
    <Text style={styles.text}>{address}</Text>
    <Text style={styles.text}>Generated on: {date}</Text>
  </View>
);