import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/scalling';
import { colors } from '../../../utils/colors';

export const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  filterButtonsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.secundaria,
    backgroundColor: colors.white,
  },
  filterButtonText: {
    fontSize: scale(18),
    fontWeight: '700',
    color: colors.secundaria,
    flexShrink: 1,
    textAlign: 'center',
  },
  selectedFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backButtonSpacer: {
    width: 40,
  },
  selectedFilterText: {
    flex: 1,
    fontSize: scale(24),
    fontWeight: '700',
    color: colors.secundaria,
    textAlign: 'center',
  },
  textTitle: {
    color: colors.secundaria,
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
});
