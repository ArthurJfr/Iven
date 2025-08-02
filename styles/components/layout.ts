// Styles de layout
import { StyleSheet } from 'react-native';
import { spacing } from '../tokens/spacing';

export const layoutStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
  },
  
  containerPadded: {
    flex: 1,
    padding: spacing[5],
  },
  
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  containerCenteredPadded: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[5],
  },
  
  // Sections
  section: {
    marginBottom: spacing[8],
  },
  
  sectionPadded: {
    padding: spacing[5],
    marginBottom: spacing[8],
  },
  
  // Flexbox utilities
  row: {
    flexDirection: 'row',
  },
  
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  rowAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  
  // Alignement
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  centerHorizontal: {
    alignItems: 'center',
  },
  
  centerVertical: {
    justifyContent: 'center',
  },
  
  // Espacement
  gap1: { gap: spacing[1] },
  gap2: { gap: spacing[2] },
  gap3: { gap: spacing[3] },
  gap4: { gap: spacing[4] },
  gap5: { gap: spacing[5] },
  gap6: { gap: spacing[6] },
  gap8: { gap: spacing[8] },
}); 