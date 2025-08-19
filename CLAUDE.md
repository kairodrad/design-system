# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive Vue.js design system specifically built for card game web applications. It features Tailwind CSS integration, pastel theming, accessibility-first design, and mobile-responsive components optimized for gaming interfaces.

## Architecture & Technology Stack

**Core Technologies:**
- **Vue 3** with Composition API
- **Tailwind CSS** with custom configuration
- **Vite** for development and building
- **PostCSS** for CSS processing

**Key Design Decisions:**
- Mobile-first responsive design approach
- CSS custom properties for dynamic theming
- Composables for reusable logic (useTheme)
- Component-based architecture with slot patterns
- Accessibility-first development with ARIA compliance

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Build CSS only (for external usage)
npm run build-css
```

## Core Architecture Patterns

### Theme System
The design system uses a sophisticated theming architecture:
- **CSS Custom Properties** for dynamic color switching
- **Three theme modes**: light, dark, system (auto-detects OS preference)
- **useTheme composable** for theme management in components
- **Automatic theme persistence** via localStorage
- **Smooth transitions** between theme switches

### Component Design Patterns
All components follow consistent patterns:
- **Prop validation** with comprehensive validator functions
- **Event emission** for parent-child communication
- **Slot patterns** for flexible content injection
- **Accessibility attributes** (ARIA labels, roles, keyboard navigation)
- **Size variants** (xs, sm, md, lg, xl) for responsive design
- **State management** (loading, disabled, selected, etc.)

### Styling Architecture
- **Utility-first approach** with Tailwind CSS
- **Component-specific styles** in scoped `<style>` blocks
- **CSS layers** (@layer base, components, utilities) for proper cascade
- **Responsive modifiers** for mobile-first design
- **Animation utilities** with prefers-reduced-motion support

## Component Library Structure

### Base Components
- **BaseButton**: Flexible button with variants, sizes, states
- **BaseModal**: Accessible modal with focus management
- **GameCard**: Interactive playing card with animations

### Game-Specific Components
- **HealthBar**: Animated progress bars with color coding
- **ScoreDisplay**: Animated score counters with formatting
- **CardHand**: Sophisticated card hand with multiple layouts

### Composables
- **useTheme**: Theme management and system preference detection
- **useThemeColors**: Computed theme colors for JavaScript usage

## File Organization

```
src/
├── components/
│   ├── BaseButton.vue          # Core button component
│   ├── BaseModal.vue           # Modal with a11y features
│   ├── GameCard.vue            # Interactive playing card
│   └── game-ui/                # Game-specific components
│       ├── HealthBar.vue       # Progress/health bars
│       ├── ScoreDisplay.vue    # Animated score display
│       └── CardHand.vue        # Card hand layouts
├── composables/
│   └── useTheme.js             # Theme management logic
├── styles/
│   └── main.css                # Global styles & Tailwind
├── App.vue                     # Demo application
├── main.js                     # App initialization
└── index.js                    # Library exports
```

## Accessibility Implementation

### Keyboard Navigation
- Tab/Shift+Tab for focus management
- Enter/Space for activation
- Arrow keys for card selection
- Escape for modal dismissal

### Screen Reader Support
- Comprehensive ARIA labels and roles
- Live regions for dynamic content
- Semantic HTML structure
- Descriptive alt text and labels

### Visual Accessibility
- High contrast mode support
- Focus indicators on all interactive elements
- Minimum 44px touch targets for mobile
- Reduced motion preferences respected

## Design Token System

### Color System
Pastel color families with 6-9 shades each:
- **pastel-pink**: Light themes use lighter shades, dark themes use saturated versions
- **pastel-blue**: Primary brand color family
- **pastel-green**: Success states and health indicators
- **pastel-purple**: Secondary accents and mana systems
- **pastel-orange**: Warning states and energy systems
- **pastel-yellow**: Caution and special states

### Responsive Breakpoints
```css
xs: '375px'    /* Small mobile */
sm: '640px'    /* Large mobile */
md: '768px'    /* Tablet */
lg: '1024px'   /* Desktop */
xl: '1280px'   /* Large desktop */
2xl: '1536px'  /* Extra large */
```

### Animation System
- **Card animations**: deal, flip, bounce, slide, fade
- **Transition durations**: 200ms for micro-interactions, 300ms for page transitions
- **Easing functions**: Custom cubic-bezier for smooth game feel
- **60fps performance**: Hardware-accelerated transforms

## Usage Patterns

### Installing the Design System
```javascript
import { createApp } from 'vue'
import CardGameDesignSystem from './src/index.js'

const app = createApp(App)
app.use(CardGameDesignSystem)
```

### Component Usage Examples
```vue
<!-- Themed button with loading state -->
<BaseButton variant="primary" :loading="isDealing" @click="dealCards">
  Deal Cards
</BaseButton>

<!-- Interactive game card -->
<GameCard 
  rank="A" 
  suit="hearts" 
  :selected="isSelected"
  @click="selectCard"
/>

<!-- Animated health bar -->
<HealthBar 
  :value="playerHealth" 
  :max-value="100"
  variant="health"
  show-warning
/>
```

### Theme Management
```javascript
import { useTheme } from './composables/useTheme.js'

const { theme, setTheme, toggleTheme, isDark } = useTheme()
```

## Performance Considerations

- **Lazy loading**: Components can be imported individually
- **Tree shaking**: Unused components are eliminated in builds
- **CSS purging**: Tailwind removes unused styles in production
- **Animation optimization**: Uses transform and opacity for 60fps
- **Bundle size**: Core library is designed to be lightweight

## Browser Support

- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Required features**: CSS Custom Properties, ES2020, CSS Grid, Flexbox

## Testing Strategy

- **Component testing**: Each component should be tested in isolation
- **Accessibility testing**: Automated a11y testing with axe-core
- **Visual regression**: Screenshot testing for UI consistency
- **Theme testing**: Verify all themes render correctly
- **Responsive testing**: Test across all breakpoints

## Extension Guidelines

### Adding New Components
1. Follow existing component patterns (props, events, slots)
2. Include comprehensive prop validation
3. Implement accessibility features
4. Add size variants and responsive behavior
5. Support all theme modes
6. Include animation and transition states

### Custom Theme Colors
Extend the Tailwind config with new color families following the existing pattern:
```javascript
colors: {
  'custom-color': {
    50: '#lightest',
    // ... through ...
    900: '#darkest'
  }
}
```

### Performance Guidelines
- Use CSS transforms for animations
- Implement prefers-reduced-motion
- Lazy load heavy components
- Optimize bundle size with tree shaking