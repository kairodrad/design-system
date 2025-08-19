# Card Game Design System

A comprehensive, production-ready design system built specifically for card game web applications. Features Vue.js components, Tailwind CSS integration, pastel theming, and complete accessibility support.

## 🎯 Features

- **🎨 Pastel Theming**: Light, dark, and system themes with beautiful pastel color palettes
- **🃏 Card Game Components**: Specialized components for cards, hands, health bars, and game UI
- **♿ Accessibility First**: Full ARIA support, keyboard navigation, and screen reader compatibility
- **📱 Mobile-First**: Responsive design optimized for both desktop and mobile gaming
- **⚡ Performance**: Optimized animations and 60fps smooth transitions
- **🔧 Developer Experience**: TypeScript support, comprehensive documentation, and Vue 3 composition API

## 🚀 Quick Start

### Installation

```bash
npm install card-game-design-system
```

### Basic Setup

```javascript
import { createApp } from 'vue'
import CardGameDesignSystem from 'card-game-design-system'
import 'card-game-design-system/dist/style.css'

const app = createApp(App)
app.use(CardGameDesignSystem)
app.mount('#app')
```

### Using Components

```vue
<template>
  <div>
    <!-- Theme-aware button -->
    <BaseButton variant="primary" @click="dealCards">
      Deal Cards
    </BaseButton>
    
    <!-- Interactive game card -->
    <GameCard 
      rank="A" 
      suit="hearts" 
      @click="selectCard"
      :selected="isSelected"
    />
    
    <!-- Animated health bar -->
    <HealthBar 
      :value="playerHealth" 
      :max-value="100"
      variant="health"
      animated
    />
    
    <!-- Card hand with fan layout -->
    <CardHand 
      :cards="playerCards"
      layout="fan"
      @card-select="handleCardSelection"
    />
  </div>
</template>
```

## 🎨 Theming

The design system includes a robust theming system with three modes:

### Theme Usage

```javascript
import { useTheme } from 'card-game-design-system'

export default {
  setup() {
    const { theme, setTheme, toggleTheme, isDark } = useTheme()
    
    return {
      theme,
      setTheme,
      toggleTheme,
      isDark
    }
  }
}
```

### Available Themes

- **Light Theme**: Clean whites with dark text and pastel accents
- **Dark Theme**: Rich darks with light text and brighter pastels  
- **System Theme**: Automatically follows OS preference (default)

### Color Palette

The system includes six carefully crafted pastel color families:
- **Pink**: `#fef7f7` to `#b52d2d`
- **Blue**: `#f0f9ff` to `#0369a1` 
- **Green**: `#f0fdf4` to `#15803d`
- **Purple**: `#faf5ff` to `#7c3aed`
- **Orange**: `#fff7ed` to `#c2410c`
- **Yellow**: `#fefce8` to `#713f12`

## 🧩 Core Components

### BaseButton
Flexible button component with multiple variants and states.

```vue
<BaseButton 
  variant="primary" 
  size="lg" 
  :loading="isLoading"
  @click="handleAction"
>
  Action Button
</BaseButton>
```

**Props**: `variant`, `size`, `loading`, `disabled`, `block`, `iconOnly`

### BaseModal
Accessible modal with focus management and backdrop handling.

```vue
<BaseModal 
  :is-open="showModal" 
  title="Game Settings"
  @close="showModal = false"
>
  <p>Modal content goes here</p>
  
  <template #footer>
    <BaseButton @click="save">Save</BaseButton>
  </template>
</BaseModal>
```

**Props**: `isOpen`, `title`, `size`, `closeOnBackdrop`, `trapFocus`

### GameCard
Interactive playing card with animations and state management.

```vue
<GameCard 
  rank="K" 
  suit="spades"
  :selected="isSelected"
  :flipped="faceDown"
  size="md"
  @click="selectCard"
/>
```

**Props**: `rank`, `suit`, `selected`, `flipped`, `disabled`, `size`, `animation`

## 🎮 Game-Specific Components

### HealthBar
Animated health/progress bar with color coding and change indicators.

```vue
<HealthBar 
  :value="currentHealth" 
  :max-value="maxHealth"
  variant="health"
  :show-warning="true"
  animated
/>
```

**Variants**: `health`, `mana`, `energy`, `shield`, `experience`

### ScoreDisplay
Animated score counter with formatting options.

```vue
<ScoreDisplay 
  :value="playerScore"
  format="comma"
  :animated="true"
  :show-change-indicator="true"
  prefix="$"
/>
```

**Formats**: `none`, `comma`, `compact`, `currency`

### CardHand
Sophisticated card hand component with multiple layout options.

```vue
<CardHand 
  :cards="handCards"
  layout="fan"
  :selectable="true"
  selection-mode="multiple"
  @selection-change="updateSelection"
/>
```

**Layouts**: `fan`, `straight`, `grid`, `stack`, `cascade`

## ♿ Accessibility Features

### Keyboard Navigation
- **Tab/Shift+Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and select cards  
- **Arrow Keys**: Navigate within card hands and grids
- **Escape**: Close modals and cancel actions

### Screen Reader Support
- Comprehensive ARIA labels for all components
- Live regions for dynamic content updates
- Semantic HTML structure throughout
- Card rank and suit announcements

### Visual Accessibility
- High contrast mode support
- Reduced motion preferences respected
- Focus indicators on all interactive elements
- Minimum 44px touch targets on mobile

## 📱 Mobile Optimizations

- **Touch-First Design**: Optimized touch targets and gestures
- **Responsive Layouts**: Fluid grids and flexible components
- **Performance**: Hardware-accelerated animations
- **Viewport**: Proper meta tags and safe area handling

## 🔧 Development

### Prerequisites
- Node.js 16+
- Vue 3
- Modern browser with CSS custom properties support

### Build Commands

```bash
# Development
npm run dev

# Build library
npm run build

# Build CSS only
npm run build-css
```

### Project Structure

```
design-system/
├── src/
│   ├── components/           # Vue components
│   │   ├── BaseButton.vue
│   │   ├── BaseModal.vue
│   │   ├── GameCard.vue
│   │   └── game-ui/         # Game-specific components
│   ├── composables/         # Vue composables
│   │   └── useTheme.js
│   └── styles/              # CSS and Tailwind
│       └── main.css
├── docs/                    # Documentation and examples
└── dist/                   # Built library files
```

## 🎯 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features Used**: CSS Custom Properties, ES2020, CSS Grid, Flexbox

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📖 Documentation

- [Component Examples](docs/component-examples.html) - Interactive component showcase
- [Theme Guide](docs/theming.md) - Detailed theming documentation
- [Accessibility Guide](docs/accessibility.md) - Accessibility implementation details

## 🆘 Support

- [GitHub Issues](https://github.com/your-org/card-game-design-system/issues)
- [Documentation](https://your-org.github.io/card-game-design-system/)
- [Discord Community](https://discord.gg/your-server)

---

Built with ❤️ for the card game development community.