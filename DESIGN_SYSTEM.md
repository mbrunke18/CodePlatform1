# M - PREMIUM DESIGN SYSTEM
## Enterprise Executive Grade UI/UX Standards

### Core Design Philosophy
- **Minimalist Sophistication**: White space, breathing room, subtle elegance
- **Executive Navy + Premium White**: Navy backgrounds with white text for authority, white backgrounds with navy text for clarity
- **Zero Distractions**: Clear information hierarchy, single focal point per section
- **Dark Mode Excellence**: Sophisticated, not gimmicky - professional all the way through
- **Premium Typography**: Inter font family, precise hierarchy, generous line-height
- **Micro-interactions**: Subtle, purposeful, not flashy

### Color Palette (Executive Grade)
- **Primary (Navy)**: #0A1F44 (hsl(218, 74%, 15%)) - Authority, trust, executive presence
- **Secondary (Light)**: #F8F9FC (hsl(210, 30%, 98%)) - Clean, professional
- **Accent (Gold)**: #D4AF37 (hsl(46, 65%, 40%)) - Premium, luxury, highlights
- **Text Dark**: #1A2D4D (hsl(218, 50%, 20%))
- **Text Light**: #E0E5F0 (hsl(210, 20%, 90%))
- **Neutral Gray**: #64748B (hsl(218, 40%, 35%))

### Typography Hierarchy
- **Title (H1)**: 3.5rem / 56px, bold, navy, with 1.3 line-height
- **Subtitle (H2)**: 2rem / 32px, semibold, navy
- **Heading (H3)**: 1.5rem / 24px, semibold, navy
- **Body**: 1rem / 16px, regular, gray-700
- **Small**: 0.875rem / 14px, regular, gray-600
- **Caption**: 0.75rem / 12px, regular, gray-500

### Spacing Grid (8px Base)
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Component Standards
1. **Cards**: White bg, subtle border (hsl(210, 20%, 88%)), 8px rounded, shadow-sm
2. **Buttons**: Navy bg, white text, 12px px, 8px py, rounded 6px, hover scale 102%
3. **Inputs**: White bg, border gray-300, navy text, focus ring navy
4. **Badges**: Navy bg, white text, 12px px, 4px py, rounded 4px
5. **Dividers**: Single pixel, hsl(210, 20%, 88%)

### Dark Mode
- **Background**: hsl(218, 30%, 8%) - Almost black but not pure
- **Card**: hsl(218, 25%, 12%) - Subtle contrast
- **Text**: hsl(210, 20%, 92%) - High contrast
- **Border**: hsl(218, 18%, 22%) - Subtle, sophisticated
- **Accent**: hsl(46, 65%, 60%) - Bright gold pops against dark

### Responsive Design
- Mobile: 320px - no sidebars, full-width cards
- Tablet: 768px - single column layouts, 2-column grids
- Desktop: 1280px - full layouts, 3-4 column grids
- Max width: 7xl (80rem / 1280px) for content

### Information Architecture
- **Hero/Header**: Large title, subtitle, CTA (32px top padding)
- **Section**: Title, description, content grid (24px spacing)
- **Cards**: Icon/badge, title, description, action
- **Metrics**: Large numbers, small labels, icon accent
- **Navigation**: Clear, scannable, consistent across all pages

### Accessibility (WCAG AAA)
- Contrast: 7:1 minimum for body text
- Focus: Clear 2px ring on interactive elements
- Spacing: Touch targets 44px minimum
- Keyboard: All interactive elements keyboard accessible
- Color: Never color-only - always include icons/text indicators

### Premium Interactions
- Hover: Scale 102% + shadow increase
- Click: Scale 98% (tactile feedback)
- Transition: 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Loading: Subtle skeleton shimmer
- Success: Green success indicator with icon
- Error: Red error state with clear message

### Page Structure Template
```
1. Hero/Header Section (Navy bg, white text, large typography)
2. Content Sections (White/Light bg, navy text)
3. Supporting Information (Metrics, cards in grid)
4. CTA/Action (Primary button, navy bg)
5. Footer (Optional, navy bg or transparent)
```

### Design Audit Checklist
- [ ] Hero section has clear title, subtitle, CTA
- [ ] All cards have consistent styling
- [ ] Typography hierarchy is clear (H1 > H2 > Body)
- [ ] Spacing follows 8px grid
- [ ] Dark mode works without colors changing meaning
- [ ] All interactive elements have hover state
- [ ] Focus rings visible on keyboard navigation
- [ ] No scattered gradients - clean backgrounds only
- [ ] Icons consistent with Lucide style
- [ ] Mobile responsive tested
