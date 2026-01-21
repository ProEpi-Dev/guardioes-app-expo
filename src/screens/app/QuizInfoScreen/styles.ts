import { StyleSheet } from "react-native";
import { scale } from "../../../utils/scalling";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    justifyContent: 'space-between'
  },
  instructionsContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  iconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8
  },
  sectionTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#333',
  },
  instructionText: {
    fontSize: scale(14),
    color: '#555',
    lineHeight: 24,
  },
  attemptContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop:5
  },
  attemptLabel: {
    fontSize: scale(16),
    color: '#666',
    marginTop: 10,
  },
  attemptNumber: {
    fontSize: scale(32),
    fontWeight: 'bold',
    color: '#FFA000', 
    marginVertical: 5,
  },
  attemptSub: {
    fontSize: scale(12),
    color: '#999',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0000ff',
    elevation: 2,
  },
  disabledButton: {
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
    elevation: 0
  },
  secondaryButtonText: {
    color: '#0000ff',
    fontWeight: 'bold',
    fontSize: scale(14),
    marginLeft: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0000ff',
    paddingVertical: 15,
    borderRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: scale(14),
    marginRight: 8,
  },
});