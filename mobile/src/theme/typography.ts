// Typography scale for consistent text hierarchy
// Uses system fonts for native performance and accessibility

export const typography = {
  // Font families
  fonts: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  
  // Font sizes (using modular scale)
  sizes: {
    xs: 12,    // Small captions
    sm: 14,    // Body text
    base: 16,  // Base text size
    lg: 18,    // Large body
    xl: 20,    // Small headings
    xxl: 24,   // Medium headings
    xxxl: 32,  // Large headings
    xxxxl: 40, // Display headings
  },
  
  // Font weights
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line heights for readability
  lineHeights: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
    xxxxl: 48,
  },
  
  // Letter spacing for optimal readability
  letterSpacing: {
    xs: -0.5,
    sm: -0.25,
    base: 0,
    lg: 0.25,
    xl: 0.5,
  },
  
  // Text styles
  textStyles: {
    // Display styles
    display: {
      fontSize: 40,
      fontWeight: '700',
      lineHeight: 48,
      letterSpacing: 0.25,
    },
    
    // Heading styles
    heading1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
      letterSpacing: 0.25,
    },
    
    heading2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 36,
      letterSpacing: 0,
    },
    
    heading3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 32,
      letterSpacing: 0,
    },
    
    // Body styles
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 28,
      letterSpacing: 0,
    },
    
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      letterSpacing: 0,
    },
    
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    
    // Caption styles
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    
    // Button styles
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
      letterSpacing: 0.5,
    },
    
    // Input styles
    input: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      letterSpacing: 0,
    },
    
    // Label styles
    label: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
      letterSpacing: 0.25,
    },
  },
} as const;

export type TypographyScale = keyof typeof typography.sizes;
export type TextStyle = keyof typeof typography.textStyles;
