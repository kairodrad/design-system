<template>
  <div
    class="health-bar-container"
    :class="containerClasses"
    role="progressbar"
    :aria-valuenow="currentValue"
    :aria-valuemin="0"
    :aria-valuemax="maxValue"
    :aria-label="ariaLabel"
  >
    <!-- Health bar background -->
    <div class="health-bar">
      <!-- Health bar fill -->
      <div
        :class="fillClasses"
        :style="fillStyle"
      >
        <!-- Animated shine effect -->
        <div
          v-if="animated"
          class="health-bar-shine"
        />
      </div>
      
      <!-- Damage/heal animation overlay -->
      <div
        v-if="showChangeAnimation"
        :class="changeAnimationClasses"
        :style="changeAnimationStyle"
      />
    </div>
    
    <!-- Health bar label/text -->
    <div
      v-if="showLabel"
      class="health-bar-label"
    >
      <slot name="label">
        <span class="health-bar-text">
          {{ labelText }}
        </span>
      </slot>
    </div>
    
    <!-- Icons -->
    <div
      v-if="$slots.icon"
      class="health-bar-icon"
    >
      <slot name="icon" />
    </div>
  </div>
</template>

<script>
import { computed, ref, watch, nextTick } from 'vue'

export default {
  name: 'HealthBar',
  props: {
    /**
     * Current health value
     */
    value: {
      type: Number,
      required: true,
      validator: (value) => value >= 0
    },
    
    /**
     * Maximum health value
     */
    maxValue: {
      type: Number,
      default: 100,
      validator: (value) => value > 0
    },
    
    /**
     * Health bar size
     */
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    
    /**
     * Health bar color variant
     */
    variant: {
      type: String,
      default: 'health',
      validator: (value) => [
        'health', 'mana', 'energy', 'shield', 'experience'
      ].includes(value)
    },
    
    /**
     * Whether to show percentage or value label
     */
    showLabel: {
      type: Boolean,
      default: false
    },
    
    /**
     * Label format: 'percentage', 'fraction', 'value'
     */
    labelFormat: {
      type: String,
      default: 'percentage',
      validator: (value) => ['percentage', 'fraction', 'value'].includes(value)
    },
    
    /**
     * Whether to animate changes
     */
    animated: {
      type: Boolean,
      default: true
    },
    
    /**
     * Animation duration in milliseconds
     */
    animationDuration: {
      type: Number,
      default: 500
    },
    
    /**
     * Whether to show warning colors at low health
     */
    showWarning: {
      type: Boolean,
      default: true
    },
    
    /**
     * Warning threshold percentage (0-1)
     */
    warningThreshold: {
      type: Number,
      default: 0.25,
      validator: (value) => value >= 0 && value <= 1
    },
    
    /**
     * Critical threshold percentage (0-1)
     */
    criticalThreshold: {
      type: Number,
      default: 0.1,
      validator: (value) => value >= 0 && value <= 1
    },
    
    /**
     * Custom aria label
     */
    ariaLabel: {
      type: String,
      default: null
    }
  },
  
  setup(props) {
    const previousValue = ref(props.value)
    const showChangeAnimation = ref(false)
    const changeAnimationType = ref('none') // 'damage' or 'heal'
    
    // Computed values
    const currentValue = computed(() => Math.max(0, Math.min(props.value, props.maxValue)))
    const percentage = computed(() => (currentValue.value / props.maxValue) * 100)
    const isLowHealth = computed(() => percentage.value <= (props.warningThreshold * 100))
    const isCriticalHealth = computed(() => percentage.value <= (props.criticalThreshold * 100))
    
    // Size classes
    const sizeClasses = {
      xs: 'h-1',
      sm: 'h-2', 
      md: 'h-3',
      lg: 'h-4',
      xl: 'h-6'
    }
    
    // Variant color classes
    const variantClasses = {
      health: {
        normal: 'bg-pastel-green-400',
        warning: 'bg-pastel-orange-400',
        critical: 'bg-pastel-pink-500'
      },
      mana: {
        normal: 'bg-pastel-blue-400',
        warning: 'bg-pastel-blue-300',
        critical: 'bg-pastel-blue-200'
      },
      energy: {
        normal: 'bg-pastel-yellow-400',
        warning: 'bg-pastel-orange-400',
        critical: 'bg-pastel-pink-400'
      },
      shield: {
        normal: 'bg-pastel-purple-400',
        warning: 'bg-pastel-purple-300',
        critical: 'bg-pastel-purple-200'
      },
      experience: {
        normal: 'bg-pastel-blue-500',
        warning: 'bg-pastel-blue-400',
        critical: 'bg-pastel-blue-300'
      }
    }
    
    // Container classes
    const containerClasses = computed(() => [
      'flex',
      'items-center',
      'gap-2',
      'w-full'
    ])
    
    // Fill classes
    const fillClasses = computed(() => {
      const baseClasses = ['health-bar-fill', 'relative', 'overflow-hidden']
      
      if (props.showWarning) {
        if (isCriticalHealth.value) {
          baseClasses.push(variantClasses[props.variant].critical)
        } else if (isLowHealth.value) {
          baseClasses.push(variantClasses[props.variant].warning)
        } else {
          baseClasses.push(variantClasses[props.variant].normal)
        }
      } else {
        baseClasses.push(variantClasses[props.variant].normal)
      }
      
      if (isCriticalHealth.value && props.animated) {
        baseClasses.push('animate-pulse-soft')
      }
      
      return baseClasses
    })
    
    // Fill style
    const fillStyle = computed(() => ({
      width: `${percentage.value}%`,
      transition: props.animated ? `width ${props.animationDuration}ms ease-out` : 'none'
    }))
    
    // Change animation classes
    const changeAnimationClasses = computed(() => [
      'absolute',
      'inset-0',
      'pointer-events-none',
      changeAnimationType.value === 'damage' ? 'bg-red-400' : 'bg-green-400',
      'animate-fade-in'
    ])
    
    // Change animation style
    const changeAnimationStyle = computed(() => ({
      width: `${Math.abs(currentValue.value - previousValue.value) / props.maxValue * 100}%`,
      left: changeAnimationType.value === 'damage' ? `${percentage.value}%` : '0%'
    }))
    
    // Label text
    const labelText = computed(() => {
      switch (props.labelFormat) {
        case 'percentage':
          return `${Math.round(percentage.value)}%`
        case 'fraction':
          return `${currentValue.value}/${props.maxValue}`
        case 'value':
          return currentValue.value.toString()
        default:
          return `${Math.round(percentage.value)}%`
      }
    })
    
    // Computed aria label
    const computedAriaLabel = computed(() => {
      return props.ariaLabel || `${props.variant} ${labelText.value}`
    })
    
    // Watch for value changes to trigger animations
    watch(
      () => props.value,
      async (newValue, oldValue) => {
        if (!props.animated || newValue === oldValue) return
        
        // Determine animation type
        if (newValue < oldValue) {
          changeAnimationType.value = 'damage'
        } else if (newValue > oldValue) {
          changeAnimationType.value = 'heal'
        }
        
        // Show change animation
        showChangeAnimation.value = true
        
        // Hide animation after duration
        setTimeout(() => {
          showChangeAnimation.value = false
        }, props.animationDuration)
        
        // Update previous value
        await nextTick()
        previousValue.value = newValue
      },
      { immediate: false }
    )
    
    return {
      currentValue,
      percentage,
      containerClasses,
      fillClasses,
      fillStyle,
      showChangeAnimation,
      changeAnimationClasses,
      changeAnimationStyle,
      labelText,
      ariaLabel: computedAriaLabel
    }
  }
}
</script>

<style scoped>
.health-bar-container {
  position: relative;
}

.health-bar {
  width: 100%;
  height: 12px;
  background-color: var(--color-background-tertiary);
  border-radius: 9999px;
  overflow: hidden;
}

.health-bar-fill {
  height: 100%;
  transition: width 0.5s ease-out;
}

.health-bar-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shine 2s infinite;
}

.health-bar-label {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  min-width: fit-content;
}

.health-bar-text {
  white-space: nowrap;
}

.health-bar-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-text-secondary);
}

/* Shine animation */
@keyframes shine {
  0% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}

/* Size variants */
.h-1 .health-bar-icon {
  width: 1rem;
  height: 1rem;
}

.h-6 .health-bar-icon {
  width: 2rem;
  height: 2rem;
}

.h-6 .health-bar-label {
  font-size: 0.875rem;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .health-bar-label {
    font-size: 0.7rem;
  }
  
  .health-bar-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .health-bar-fill {
    transition: none !important;
  }
  
  .health-bar-shine {
    animation: none;
  }
  
  .animate-pulse-soft {
    animation: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .health-bar {
    border: 1px solid var(--color-border);
  }
  
  .health-bar-fill {
    border: 1px solid currentColor;
  }
}
</style>