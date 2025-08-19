<template>
  <div
    :class="containerClasses"
    :aria-label="ariaLabel"
    role="status"
    aria-live="polite"
  >
    <!-- Score icon -->
    <div
      v-if="$slots.icon"
      class="score-icon"
    >
      <slot name="icon" />
    </div>
    
    <!-- Score label -->
    <div
      v-if="label"
      class="score-label"
    >
      {{ label }}
    </div>
    
    <!-- Score value -->
    <div :class="valueClasses">
      <span
        v-if="prefix"
        class="score-prefix"
      >
        {{ prefix }}
      </span>
      
      <span
        ref="scoreRef"
        class="score-number"
        :class="{ 'animate-bounce-in': isAnimating }"
      >
        {{ formattedValue }}
      </span>
      
      <span
        v-if="suffix"
        class="score-suffix"
      >
        {{ suffix }}
      </span>
    </div>
    
    <!-- Change indicator -->
    <Transition
      name="change-indicator"
      appear
    >
      <div
        v-if="showChangeIndicator && changeAmount !== 0"
        :class="changeIndicatorClasses"
        :key="changeKey"
      >
        {{ changeAmount > 0 ? '+' : '' }}{{ formattedChange }}
      </div>
    </Transition>
  </div>
</template>

<script>
import { computed, ref, watch, nextTick } from 'vue'

export default {
  name: 'ScoreDisplay',
  props: {
    /**
     * Score value
     */
    value: {
      type: Number,
      required: true
    },
    
    /**
     * Score label
     */
    label: {
      type: String,
      default: ''
    },
    
    /**
     * Value prefix (e.g., '$', '+')
     */
    prefix: {
      type: String,
      default: ''
    },
    
    /**
     * Value suffix (e.g., 'pts', '%')
     */
    suffix: {
      type: String,
      default: ''
    },
    
    /**
     * Display size
     */
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(value)
    },
    
    /**
     * Score variant/theme
     */
    variant: {
      type: String,
      default: 'default',
      validator: (value) => [
        'default', 'primary', 'success', 'warning', 'error', 'game'
      ].includes(value)
    },
    
    /**
     * Number formatting options
     */
    format: {
      type: String,
      default: 'none',
      validator: (value) => ['none', 'comma', 'compact', 'currency'].includes(value)
    },
    
    /**
     * Whether to animate value changes
     */
    animated: {
      type: Boolean,
      default: true
    },
    
    /**
     * Animation duration for counting up/down
     */
    animationDuration: {
      type: Number,
      default: 1000
    },
    
    /**
     * Whether to show change indicators (+/- numbers)
     */
    showChangeIndicator: {
      type: Boolean,
      default: false
    },
    
    /**
     * Duration to show change indicator (ms)
     */
    changeIndicatorDuration: {
      type: Number,
      default: 2000
    },
    
    /**
     * Layout direction
     */
    layout: {
      type: String,
      default: 'horizontal',
      validator: (value) => ['horizontal', 'vertical'].includes(value)
    },
    
    /**
     * Alignment
     */
    align: {
      type: String,
      default: 'center',
      validator: (value) => ['left', 'center', 'right'].includes(value)
    }
  },
  
  setup(props) {
    const scoreRef = ref(null)
    const displayValue = ref(props.value)
    const previousValue = ref(props.value)
    const isAnimating = ref(false)
    const changeAmount = ref(0)
    const changeKey = ref(0)
    
    // Size classes mapping
    const sizeClasses = {
      xs: 'text-sm',
      sm: 'text-base',
      md: 'text-lg',
      lg: 'text-xl',
      xl: 'text-2xl',
      '2xl': 'text-3xl'
    }
    
    // Variant classes mapping
    const variantClasses = {
      default: 'text-[var(--color-text)]',
      primary: 'text-[var(--color-primary)]',
      success: 'text-[var(--color-success)]',
      warning: 'text-[var(--color-warning)]',
      error: 'text-[var(--color-error)]',
      game: 'text-game-win'
    }
    
    // Container classes
    const containerClasses = computed(() => {
      const classes = ['score-display-container', 'inline-flex']
      
      if (props.layout === 'vertical') {
        classes.push('flex-col', 'items-center')
      } else {
        classes.push('items-center', 'gap-2')
      }
      
      // Alignment
      if (props.align === 'left') {
        classes.push('justify-start', 'text-left')
      } else if (props.align === 'right') {
        classes.push('justify-end', 'text-right')
      } else {
        classes.push('justify-center', 'text-center')
      }
      
      return classes
    })
    
    // Value classes
    const valueClasses = computed(() => [
      'score-display',
      'font-mono',
      'font-bold',
      'tracking-wider',
      'relative',
      sizeClasses[props.size],
      variantClasses[props.variant]
    ])
    
    // Change indicator classes
    const changeIndicatorClasses = computed(() => {
      const classes = [
        'change-indicator',
        'absolute',
        'font-bold',
        'text-sm',
        'pointer-events-none',
        'z-10'
      ]
      
      if (changeAmount.value > 0) {
        classes.push('text-[var(--color-success)]')
      } else if (changeAmount.value < 0) {
        classes.push('text-[var(--color-error)]')
      }
      
      return classes
    })
    
    // Format number based on format prop
    const formatNumber = (value) => {
      switch (props.format) {
        case 'comma':
          return value.toLocaleString()
        case 'compact':
          return new Intl.NumberFormat('en', { notation: 'compact' }).format(value)
        case 'currency':
          return new Intl.NumberFormat('en', { 
            style: 'currency', 
            currency: 'USD' 
          }).format(value)
        default:
          return value.toString()
      }
    }
    
    // Formatted display value
    const formattedValue = computed(() => formatNumber(displayValue.value))
    
    // Formatted change amount
    const formattedChange = computed(() => formatNumber(Math.abs(changeAmount.value)))
    
    // Aria label for accessibility
    const ariaLabel = computed(() => {
      let label = ''
      if (props.label) {
        label += `${props.label}: `
      }
      label += `${props.prefix}${formattedValue.value}${props.suffix}`
      return label
    })
    
    // Animate value change with counting effect
    const animateValueChange = (from, to, duration) => {
      if (!props.animated || from === to) {
        displayValue.value = to
        return
      }
      
      isAnimating.value = true
      const startTime = Date.now()
      const difference = to - from
      
      const updateValue = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function (ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3)
        
        displayValue.value = Math.round(from + (difference * easedProgress))
        
        if (progress < 1) {
          requestAnimationFrame(updateValue)
        } else {
          isAnimating.value = false
        }
      }
      
      requestAnimationFrame(updateValue)
    }
    
    // Watch for value changes
    watch(
      () => props.value,
      async (newValue, oldValue) => {
        if (newValue === oldValue) return
        
        // Calculate change amount for indicator
        changeAmount.value = newValue - oldValue
        changeKey.value++
        
        // Animate to new value
        animateValueChange(displayValue.value, newValue, props.animationDuration)
        
        // Hide change indicator after duration
        if (props.showChangeIndicator && changeAmount.value !== 0) {
          setTimeout(() => {
            changeAmount.value = 0
          }, props.changeIndicatorDuration)
        }
        
        previousValue.value = oldValue
      },
      { immediate: false }
    )
    
    return {
      scoreRef,
      displayValue,
      formattedValue,
      formattedChange,
      containerClasses,
      valueClasses,
      changeIndicatorClasses,
      changeAmount,
      changeKey,
      isAnimating,
      ariaLabel
    }
  }
}
</script>

<style scoped>
.score-display-container {
  position: relative;
}

.score-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 0.25rem;
}

.score-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-text-secondary);
}

.score-prefix,
.score-suffix {
  font-size: 0.8em;
  opacity: 0.8;
}

.score-number {
  position: relative;
  display: inline-block;
}

.change-indicator {
  top: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  animation: changeFloat 2s ease-out forwards;
}

/* Change indicator animations */
.change-indicator-enter-active,
.change-indicator-leave-active {
  transition: all 0.3s ease;
}

.change-indicator-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(10px) scale(0.8);
}

.change-indicator-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px) scale(0.8);
}

@keyframes changeFloat {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
  70% {
    opacity: 1;
    transform: translateX(-50%) translateY(-10px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px) scale(0.8);
  }
}

/* Vertical layout adjustments */
.score-display-container.flex-col .score-label {
  margin-bottom: 0.5rem;
}

.score-display-container.flex-col .change-indicator {
  top: -2rem;
}

/* Size-specific adjustments */
.text-sm .score-icon {
  width: 1rem;
  height: 1rem;
}

.text-3xl .score-icon {
  width: 2rem;
  height: 2rem;
}

.text-3xl .score-label {
  font-size: 1rem;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .score-display {
    font-size: clamp(0.875rem, 4vw, 1.5rem);
  }
  
  .score-label {
    font-size: 0.75rem;
  }
  
  .change-indicator {
    font-size: 0.7rem;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .score-number {
    transition: none !important;
  }
  
  .change-indicator {
    animation: none;
    opacity: 1;
    position: static;
    transform: none;
    display: inline-block;
    margin-left: 0.5rem;
  }
  
  .animate-bounce-in {
    animation: none !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .score-display {
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  .change-indicator {
    background: var(--color-background);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    border: 1px solid currentColor;
  }
}
</style>