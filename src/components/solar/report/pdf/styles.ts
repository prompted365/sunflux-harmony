import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#C84B31',
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'medium',
    marginBottom: 8,
    color: '#2D3748',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: '#4A5568',
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    padding: 15,
    backgroundColor: '#F7FAFC',
    borderRadius: 5,
    width: '48%',
  },
  highlight: {
    color: '#C84B31',
    fontWeight: 'bold',
  },
});