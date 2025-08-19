<template>
  <div
    :class="cardClasses"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    :tabindex="interactive ? 0 : -1"
    @keydown="handleKeydown"
    :aria-label="ariaLabel"
    role="button"
    ref="cardRef"
  >
    <!-- Card face (front) - using static image -->
    <div
      v-if="!flipped"
      class="card-face card-front"
    >
      <img
        :src="cardImageSrc"
        :alt="cardImageAlt"
        class="card-image"
        @error="handleImageError"
      />
      
      <!-- Custom card content slot -->
      <div
        v-if="$slots.default"
        class="card-content"
      >
        <slot />
      </div>
    </div>
    
    <!-- Card back - using static image -->
    <div
      v-else
      class="card-face card-back"
    >
      <img
        :src="cardBackImageSrc"
        :alt="`${backColor} card back`"
        class="card-back-image"
        @error="handleBackImageError"
      />
      
      <!-- Custom back content slot -->
      <div
        v-if="$slots.back"
        class="card-back-content"
      >
        <slot name="back" />
      </div>
    </div>
    
    <!-- Card overlay for states -->
    <div
      v-if="overlay"
      class="card-overlay"
    >
      <slot name="overlay">
        <div class="card-overlay-content">
          {{ overlay }}
        </div>
      </slot>
    </div>
    
    <!-- Selection indicator -->
    <div
      v-if="selected"
      class="card-selection-indicator"
      aria-hidden="true"
    />
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'GameCard',
  emits: ['click', 'select', 'hover'],
  props: {
    /**
     * Card rank (A, 2-10, J, Q, K)
     */
    rank: {
      type: String,
      required: true,
      validator: (value) => [
        'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'
      ].includes(value)
    },
    
    /**
     * Card suit
     */
    suit: {
      type: String,
      required: true,
      validator: (value) => ['hearts', 'diamonds', 'clubs', 'spades'].includes(value)
    },
    
    /**
     * Card back color
     */
    backColor: {
      type: String,
      default: 'blue',
      validator: (value) => ['blue', 'gray', 'green', 'purple', 'red', 'yellow'].includes(value)
    },
    
    /**
     * Whether card is flipped (showing back)
     */
    flipped: {
      type: Boolean,
      default: false
    },
    
    /**
     * Whether card is selected
     */
    selected: {
      type: Boolean,
      default: false
    },
    
    /**
     * Whether card is disabled
     */
    disabled: {
      type: Boolean,
      default: false
    },
    
    /**
     * Whether card is interactive
     */
    interactive: {
      type: Boolean,
      default: true
    },
    
    /**
     * Card size variant
     */
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    
    /**
     * Overlay text/content
     */
    overlay: {
      type: String,
      default: null
    },
    
    /**
     * Animation state
     */
    animation: {
      type: String,
      default: null,
      validator: (value) => !value || [
        'deal', 'flip', 'bounce', 'slide', 'fade'
      ].includes(value)
    },
    
    /**
     * Whether card should animate on hover
     */
    hoverEffect: {
      type: Boolean,
      default: true
    }
  },
  
  setup(props, { emit }) {
    const cardRef = ref(null)
    const isHovered = ref(false)
    
    // Suit symbol mapping for accessibility
    const suitSymbols = {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠'
    }
    
    // Suit abbreviation mapping for file names
    const suitAbbreviations = {
      hearts: 'H',
      diamonds: 'D',
      clubs: 'C',
      spades: 'S'
    }
    
    // Generate card image source path
    const cardImageSrc = computed(() => {
      const suitAbbr = suitAbbreviations[props.suit]
      const rankValue = props.rank
      return `/src/card_assets/${rankValue}${suitAbbr}.png`
    })
    
    // Generate card back image source path
    const cardBackImageSrc = computed(() => {
      return `/src/card_assets/${props.backColor}_back.png`
    })
    
    // Alt text for card image
    const cardImageAlt = computed(() => {
      return `${props.rank} of ${props.suit}`
    })
    
    // Size classes mapping
    const sizeClasses = {
      xs: 'w-12 h-16 text-xs',
      sm: 'w-16 h-20 text-sm',
      md: 'w-20 h-28 text-base',
      lg: 'w-24 h-32 text-lg',
      xl: 'w-32 h-44 text-xl'
    }
    
    // Animation classes mapping
    const animationClasses = {
      deal: 'animate-card-deal',
      flip: 'animate-card-flip',
      bounce: 'animate-bounce-in',
      slide: 'animate-slide-up',
      fade: 'animate-fade-in'
    }
    
    // Computed card classes
    const cardClasses = computed(() => {
      const classes = [
        'game-card',
        'relative',
        'select-none',
        'transition-all',
        'duration-300',
        sizeClasses[props.size]
      ]
      
      if (props.interactive && !props.disabled) {
        classes.push('cursor-pointer')
        
        if (props.hoverEffect) {
          classes.push('hover:card-hovered')
        }
      }
      
      if (props.selected) {
        classes.push('card-selected')
      }
      
      if (props.disabled) {
        classes.push('card-disabled')
      }
      
      if (props.animation) {
        classes.push(animationClasses[props.animation])
      }
      
      if (isHovered.value && !props.disabled) {
        classes.push('transform', '-translate-y-2')
      }
      
      return classes.join(' ')
    })
    
    // Accessibility label
    const ariaLabel = computed(() => {
      if (props.flipped) {
        return 'Face down card'
      }
      return `${props.rank} of ${props.suit}`
    })
    
    // Event handlers
    const handleClick = (event) => {
      if (!props.interactive || props.disabled) return
      
      emit('click', {
        rank: props.rank,
        suit: props.suit,
        selected: props.selected,
        event
      })
      
      emit('select', !props.selected)
    }
    
    const handleMouseEnter = () => {
      if (!props.interactive || props.disabled) return
      
      isHovered.value = true
      emit('hover', {
        rank: props.rank,
        suit: props.suit,
        hovered: true
      })
    }
    
    const handleMouseLeave = () => {
      isHovered.value = false
      emit('hover', {
        rank: props.rank,
        suit: props.suit,
        hovered: false
      })
    }
    
    const handleKeydown = (event) => {
      if (!props.interactive || props.disabled) return
      
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleClick(event)
      }
    }
    
    // Error handling for missing images
    const handleImageError = (event) => {
      console.warn(`Failed to load card image: ${cardImageSrc.value}`)
      // Fallback: You could set a default image or show text fallback
      event.target.style.display = 'none'
    }
    
    const handleBackImageError = (event) => {
      console.warn(`Failed to load card back image: ${cardBackImageSrc.value}`)
      // Fallback: You could set a default back image
      event.target.style.display = 'none'
    }
    
    return {
      cardRef,
      cardClasses,
      cardImageSrc,
      cardBackImageSrc,
      cardImageAlt,
      ariaLabel,
      handleClick,
      handleMouseEnter,
      handleMouseLeave,
      handleKeydown,
      handleImageError,
      handleBackImageError
    }
  }
}
</script>

<style scoped>
.game-card {
  perspective: 1000px;
}

.card-face {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-front {
  border: 1px solid #e5e7eb;
}

.card-back {
  border: 1px solid #d1d5db;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 8px;
}

.card-back-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 8px;
}


.card-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.card-back-pattern {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-back-design {
  width: 90%;
  height: 90%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-back-border {
  width: 85%;
  height: 85%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-back-inner {
  width: 80%;
  height: 80%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-back-logo {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2em;
  font-weight: bold;
  letter-spacing: 2px;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.card-overlay-content {
  color: white;
  font-weight: bold;
  text-align: center;
  padding: 1rem;
}

.card-selection-indicator {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 3px solid var(--color-primary);
  border-radius: 10px;
  pointer-events: none;
  box-shadow: 0 0 0 2px rgba(var(--color-primary), 0.2);
  z-index: 30;
}

/* Size-specific adjustments */
.w-12 .card-center {
  font-size: 1em;
}

.w-16 .card-center {
  font-size: 1.2em;
}

.w-20 .card-center {
  font-size: 1.5em;
}

.w-24 .card-center {
  font-size: 1.8em;
}

.w-32 .card-center {
  font-size: 2.5em;
}

/* Mobile touch optimization */
@media (max-width: 768px) {
  .game-card {
    min-width: 44px;
    min-height: 60px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .game-card {
    transition: none;
  }
  
  .card-face {
    animation: none !important;
  }
}
</style>