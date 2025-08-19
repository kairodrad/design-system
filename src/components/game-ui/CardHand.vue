<template>
  <div
    :class="handClasses"
    role="region"
    :aria-label="ariaLabel"
    ref="handRef"
  >
    <!-- Hand cards -->
    <TransitionGroup
      :name="animationName"
      tag="div"
      class="hand-cards"
      :class="cardsContainerClasses"
    >
      <GameCard
        v-for="(card, index) in cards"
        :key="cardKey(card, index)"
        v-bind="cardProps(card, index)"
        :class="cardClasses(card, index)"
        :style="cardStyle(card, index)"
        @click="handleCardClick(card, index, $event)"
        @select="handleCardSelect(card, index, $event)"
        @hover="handleCardHover(card, index, $event)"
      >
        <!-- Pass through card slots -->
        <template #default>
          <slot
            name="card-content"
            :card="card"
            :index="index"
          />
        </template>
        
        <template #back>
          <slot
            name="card-back"
            :card="card"
            :index="index"
          />
        </template>
        
        <template #overlay>
          <slot
            name="card-overlay"
            :card="card"
            :index="index"
          />
        </template>
      </GameCard>
    </TransitionGroup>
    
    <!-- Hand actions (if slots provided) -->
    <div
      v-if="$slots.actions"
      class="hand-actions"
      :class="actionsClasses"
    >
      <slot
        name="actions"
        :selected-cards="selectedCards"
        :hand-actions="handActions"
      />
    </div>
    
    <!-- Hand info/stats -->
    <div
      v-if="showHandInfo"
      class="hand-info"
      :class="infoClasses"
    >
      <slot name="info">
        <div class="hand-count">
          {{ cards.length }} {{ cards.length === 1 ? 'card' : 'cards' }}
        </div>
        <div
          v-if="selectedCards.length > 0"
          class="selected-count"
        >
          {{ selectedCards.length }} selected
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import { computed, ref, nextTick } from 'vue'
import GameCard from '../GameCard.vue'

export default {
  name: 'CardHand',
  components: {
    GameCard
  },
  emits: ['card-click', 'card-select', 'card-hover', 'selection-change'],
  props: {
    /**
     * Array of card objects
     */
    cards: {
      type: Array,
      default: () => []
    },
    
    /**
     * Hand layout style
     */
    layout: {
      type: String,
      default: 'fan',
      validator: (value) => [
        'fan', 'straight', 'grid', 'stack', 'cascade'
      ].includes(value)
    },
    
    /**
     * Hand size (affects card spacing and sizing)
     */
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    
    /**
     * Maximum number of cards to display
     */
    maxCards: {
      type: Number,
      default: null
    },
    
    /**
     * Whether cards can be selected
     */
    selectable: {
      type: Boolean,
      default: true
    },
    
    /**
     * Selection mode
     */
    selectionMode: {
      type: String,
      default: 'multiple',
      validator: (value) => ['single', 'multiple', 'toggle'].includes(value)
    },
    
    /**
     * Initially selected card indices
     */
    selectedIndices: {
      type: Array,
      default: () => []
    },
    
    /**
     * Whether to show hand information
     */
    showHandInfo: {
      type: Boolean,
      default: false
    },
    
    /**
     * Card animation style
     */
    animation: {
      type: String,
      default: 'slide',
      validator: (value) => ['slide', 'flip', 'fade', 'deal'].includes(value)
    },
    
    /**
     * Whether cards are interactive
     */
    interactive: {
      type: Boolean,
      default: true
    },
    
    /**
     * Whether to enable card sorting/reordering
     */
    sortable: {
      type: Boolean,
      default: false
    },
    
    /**
     * Hand orientation
     */
    orientation: {
      type: String,
      default: 'horizontal',
      validator: (value) => ['horizontal', 'vertical'].includes(value)
    },
    
    /**
     * Hand alignment
     */
    align: {
      type: String,
      default: 'center',
      validator: (value) => ['start', 'center', 'end'].includes(value)
    }
  },
  
  setup(props, { emit }) {
    const handRef = ref(null)
    const internalSelection = ref(new Set(props.selectedIndices))
    
    // Layout configurations
    const layoutConfigs = {
      fan: {
        spacing: 'overlap',
        rotation: true,
        curve: true
      },
      straight: {
        spacing: 'normal',
        rotation: false,
        curve: false
      },
      grid: {
        spacing: 'grid',
        rotation: false,
        curve: false
      },
      stack: {
        spacing: 'stack',
        rotation: false,
        curve: false
      },
      cascade: {
        spacing: 'cascade',
        rotation: false,
        curve: false
      }
    }
    
    // Size configurations
    const sizeConfigs = {
      xs: { cardSize: 'xs', spacing: 8, fanAngle: 3 },
      sm: { cardSize: 'sm', spacing: 12, fanAngle: 4 },
      md: { cardSize: 'md', spacing: 16, fanAngle: 5 },
      lg: { cardSize: 'lg', spacing: 20, fanAngle: 6 },
      xl: { cardSize: 'xl', spacing: 24, fanAngle: 7 }
    }
    
    // Computed properties
    const config = computed(() => layoutConfigs[props.layout])
    const sizeConfig = computed(() => sizeConfigs[props.size])
    const selectedCards = computed(() => 
      props.cards.filter((_, index) => internalSelection.value.has(index))
    )
    
    // Classes
    const handClasses = computed(() => [
      'card-hand',
      `layout-${props.layout}`,
      `size-${props.size}`,
      `orientation-${props.orientation}`,
      `align-${props.align}`,
      {
        'interactive': props.interactive,
        'sortable': props.sortable
      }
    ])
    
    const cardsContainerClasses = computed(() => [
      'relative',
      'flex',
      {
        'flex-col': props.orientation === 'vertical',
        'justify-start': props.align === 'start',
        'justify-center': props.align === 'center',
        'justify-end': props.align === 'end'
      }
    ])
    
    const actionsClasses = computed(() => [
      'mt-4',
      'flex',
      'gap-2',
      'justify-center'
    ])
    
    const infoClasses = computed(() => [
      'mt-2',
      'text-center',
      'text-sm',
      'text-[var(--color-text-secondary)]'
    ])
    
    // Animation name for transitions
    const animationName = computed(() => `hand-${props.animation}`)
    
    // Aria label
    const ariaLabel = computed(() => 
      `Hand with ${props.cards.length} cards, ${selectedCards.value.length} selected`
    )
    
    // Card key function for transitions
    const cardKey = (card, index) => {
      return card.id || `${card.suit}-${card.rank}-${index}`
    }
    
    // Card props function
    const cardProps = (card, index) => ({
      ...card,
      size: sizeConfig.value.cardSize,
      selected: internalSelection.value.has(index),
      interactive: props.interactive,
      animation: index === props.cards.length - 1 ? props.animation : null
    })
    
    // Card classes function
    const cardClasses = (card, index) => {
      const classes = ['hand-card']
      
      if (props.layout === 'fan') {
        classes.push('fan-card')
      }
      
      if (internalSelection.value.has(index)) {
        classes.push('selected')
      }
      
      return classes
    }
    
    // Card style function for positioning
    const cardStyle = (card, index) => {
      const style = {}
      const totalCards = props.cards.length
      const centerIndex = (totalCards - 1) / 2
      
      switch (props.layout) {
        case 'fan':
          const fanAngle = sizeConfig.value.fanAngle
          const rotation = (index - centerIndex) * fanAngle
          const offsetY = Math.abs(index - centerIndex) * 2
          
          style.transform = `rotate(${rotation}deg) translateY(${offsetY}px)`
          style.zIndex = totalCards - Math.abs(index - centerIndex)
          
          if (props.orientation === 'horizontal') {
            style.marginLeft = index > 0 ? `-${sizeConfig.value.spacing}px` : '0'
          }
          break
          
        case 'straight':
          if (props.orientation === 'horizontal') {
            style.marginLeft = index > 0 ? `${sizeConfig.value.spacing}px` : '0'
          } else {
            style.marginTop = index > 0 ? `${sizeConfig.value.spacing}px` : '0'
          }
          break
          
        case 'stack':
          style.zIndex = index
          if (index > 0) {
            style.marginLeft = '-90%'
            style.marginTop = '2px'
          }
          break
          
        case 'cascade':
          style.zIndex = index
          if (index > 0) {
            style.marginLeft = '-70%'
            style.marginTop = '8px'
          }
          break
          
        case 'grid':
          // Grid layout handled by CSS
          break
      }
      
      return style
    }
    
    // Hand actions
    const handActions = {
      selectAll: () => {
        const allIndices = Array.from({ length: props.cards.length }, (_, i) => i)
        internalSelection.value = new Set(allIndices)
        emit('selection-change', selectedCards.value)
      },
      
      deselectAll: () => {
        internalSelection.value.clear()
        emit('selection-change', selectedCards.value)
      },
      
      invertSelection: () => {
        const newSelection = new Set()
        for (let i = 0; i < props.cards.length; i++) {
          if (!internalSelection.value.has(i)) {
            newSelection.add(i)
          }
        }
        internalSelection.value = newSelection
        emit('selection-change', selectedCards.value)
      }
    }
    
    // Event handlers
    const handleCardClick = (card, index, event) => {
      emit('card-click', { card, index, event })
      
      if (props.selectable) {
        handleCardSelect(card, index, !internalSelection.value.has(index))
      }
    }
    
    const handleCardSelect = (card, index, selected) => {
      if (!props.selectable) return
      
      const newSelection = new Set(internalSelection.value)
      
      switch (props.selectionMode) {
        case 'single':
          newSelection.clear()
          if (selected) {
            newSelection.add(index)
          }
          break
          
        case 'multiple':
          if (selected) {
            newSelection.add(index)
          } else {
            newSelection.delete(index)
          }
          break
          
        case 'toggle':
          if (newSelection.has(index)) {
            newSelection.delete(index)
          } else {
            newSelection.add(index)
          }
          break
      }
      
      internalSelection.value = newSelection
      emit('card-select', { card, index, selected: newSelection.has(index) })
      emit('selection-change', selectedCards.value)
    }
    
    const handleCardHover = (card, index, event) => {
      emit('card-hover', { card, index, event })
    }
    
    return {
      handRef,
      handClasses,
      cardsContainerClasses,
      actionsClasses,
      infoClasses,
      animationName,
      ariaLabel,
      selectedCards,
      handActions,
      cardKey,
      cardProps,
      cardClasses,
      cardStyle,
      handleCardClick,
      handleCardSelect,
      handleCardHover
    }
  }
}
</script>

<style scoped>
.card-hand {
  position: relative;
  padding: 1rem;
  min-height: 120px;
}

.hand-cards {
  position: relative;
  min-height: inherit;
}

.hand-card {
  transition: all 0.3s ease;
}

.hand-card.selected {
  z-index: 1000 !important;
}

/* Layout-specific styles */
.layout-fan .hand-cards {
  align-items: flex-end;
  padding-bottom: 2rem;
}

.layout-grid .hand-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.5rem;
  align-items: start;
}

.layout-stack .hand-cards,
.layout-cascade .hand-cards {
  align-items: flex-start;
}

/* Fan card specific styles */
.fan-card {
  transform-origin: bottom center;
}

/* Animation transitions */
.hand-slide-enter-active,
.hand-slide-leave-active {
  transition: all 0.5s ease;
}

.hand-slide-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}

.hand-slide-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.hand-flip-enter-active,
.hand-flip-leave-active {
  transition: all 0.6s ease;
}

.hand-flip-enter-from,
.hand-flip-leave-to {
  opacity: 0;
  transform: rotateY(-90deg);
}

.hand-fade-enter-active,
.hand-fade-leave-active {
  transition: opacity 0.3s ease;
}

.hand-fade-enter-from,
.hand-fade-leave-to {
  opacity: 0;
}

.hand-deal-enter-active {
  transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.hand-deal-enter-from {
  opacity: 0;
  transform: translateY(-200px) rotate(180deg);
}

/* Size variations */
.size-xs {
  padding: 0.5rem;
  min-height: 80px;
}

.size-xl {
  padding: 1.5rem;
  min-height: 180px;
}

/* Orientation variations */
.orientation-vertical .hand-cards {
  flex-direction: column;
  align-items: center;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .card-hand {
    padding: 0.5rem;
  }
  
  .layout-fan .hand-cards {
    padding-bottom: 1rem;
  }
  
  .layout-grid .hand-cards {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 0.25rem;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .hand-card {
    transition: none;
  }
  
  .hand-slide-enter-active,
  .hand-slide-leave-active,
  .hand-flip-enter-active,
  .hand-flip-leave-active,
  .hand-fade-enter-active,
  .hand-fade-leave-active,
  .hand-deal-enter-active {
    transition: none;
  }
  
  .fan-card {
    transform: none !important;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .hand-card {
    /* Increase touch targets on mobile */
    min-width: 44px;
    min-height: 60px;
  }
}
</style>