
import { StyleSheet } from 'react-native';

export const operatorStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B4A2F', // Olive Drab
    padding: 16,
  },
  textPrimary: {
    color: '#FF6F00',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 0.8, height: 0.8 },
    textShadowRadius: 1.5,
  },
  accentText: {
    color: '#FFD700', // Fallback gold tone for existing hazard uses
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 0.8, height: 0.8 },
    textShadowRadius: 1.5,
  },
  button: {
    backgroundColor: '#FF6F00',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#2F2F2F',
    color: '#FF6F00',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  card: {
    backgroundColor: '#2D3A1D',
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    borderColor: '#000',
    borderWidth: 1.5,
  },
  label: {
    color: '#FFD700',
    fontWeight: '600',
    fontSize: 14,
  },
});
