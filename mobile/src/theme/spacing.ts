// Consistent spacing scale using 8-point grid system
// Ensures visual rhythm and alignment throughout the app

export const spacing = {
  // Base spacing unit (8px)
  xs: 4,    // 0.5rem
  sm: 8,    // 1rem
  md: 16,   // 2rem
  lg: 24,   // 3rem
  xl: 32,   // 4rem
  xxl: 48,  // 6rem
  xxxl: 64, // 8rem
  
  // Component-specific spacing
  padding: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  
  margin: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Layout spacing
  container: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
  
  // Form spacing
  form: {
    fieldGap: 16,
    sectionGap: 24,
    buttonGap: 12,
  },
  
  // Screen spacing
  screen: {
    padding: 24,
    contentGap: 32,
  },
} as const;

export type SpacingScale = keyof typeof spacing;
