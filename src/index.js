// Vue Card Game Design System
// Main export file for the design system

// Styles
import './styles/main.css'

// Composables - import for plugin use
import { useTheme, createThemeProvider, useThemeColors } from './composables/useTheme.js'

// Export composables for individual use  
export { useTheme, createThemeProvider, useThemeColors }

// Component imports for plugin
import BaseButton from './components/BaseButton.vue'
import BaseModal from './components/BaseModal.vue'
import GameCard from './components/GameCard.vue'
import HealthBar from './components/game-ui/HealthBar.vue'
import ScoreDisplay from './components/game-ui/ScoreDisplay.vue'
import CardHand from './components/game-ui/CardHand.vue'

// Export components for individual use
export { BaseButton, BaseModal, GameCard, HealthBar, ScoreDisplay, CardHand }

// Design System Configuration
export const DESIGN_SYSTEM_CONFIG = {
  name: 'Card Game Design System',
  version: '1.0.0',
  theme: {
    defaultTheme: 'system',
    supportedThemes: ['light', 'dark', 'system']
  },
  breakpoints: {
    xs: '375px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  colors: {
    pastel: {
      pink: ['#fef7f7', '#fdeaea', '#fbd5d5', '#f8b4b4', '#f38686', '#ec5a5a'],
      blue: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9'],
      green: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e'],
      purple: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7'],
      orange: ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316'],
      yellow: ['#fefce8', '#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308']
    }
  }
}

// Vue Plugin for easy installation
export const CardGameDesignSystem = {
  install(app, options = {}) {
    // Register all components globally
    const components = {
      BaseButton,
      BaseModal,
      GameCard,
      HealthBar,
      ScoreDisplay,
      CardHand
    }
    
    Object.keys(components).forEach(name => {
      app.component(name, components[name])
    })
    
    // Install theme provider
    app.use(createThemeProvider())
    
    // Global properties
    app.config.globalProperties.$designSystem = DESIGN_SYSTEM_CONFIG
    
    // Provide design system config
    app.provide('designSystemConfig', DESIGN_SYSTEM_CONFIG)
  }
}

// Default export for convenience
export default CardGameDesignSystem