<template>
  <div class="min-h-screen p-4">
    <!-- Header -->
    <header class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-pastel-blue-400 to-pastel-purple-400 bg-clip-text">
            Card Game Design System
          </h1>
          <p class="text-responsive-sm text-[var(--color-text-secondary)] mt-1">
            Vue.js components for card game applications
          </p>
        </div>
        
        <div class="flex items-center gap-3">
          <BaseButton
            variant="ghost"
            size="sm"
            @click="cycleTheme"
            :aria-label="`Current theme: ${themeLabel}. Click to cycle themes.`"
          >
            <template #icon>
              <span class="text-lg">
                {{ themeIcon }}
              </span>
            </template>
            {{ themeLabel }}
          </BaseButton>
        </div>
      </div>
    </header>

    <!-- Demo Sections -->
    <div class="space-y-8">
      
      <!-- Buttons Section -->
      <section class="card-base p-6">
        <h2 class="text-responsive-lg font-semibold mb-6">Buttons</h2>
        
        <div class="space-y-4">
          <div class="flex flex-wrap gap-3">
            <BaseButton variant="primary">Primary</BaseButton>
            <BaseButton variant="secondary">Secondary</BaseButton>
            <BaseButton variant="ghost">Ghost</BaseButton>
            <BaseButton variant="outline">Outline</BaseButton>
            <BaseButton variant="danger">Danger</BaseButton>
          </div>
          
          <div class="flex flex-wrap gap-3">
            <BaseButton variant="primary" size="xs">XS</BaseButton>
            <BaseButton variant="primary" size="sm">Small</BaseButton>
            <BaseButton variant="primary" size="md">Medium</BaseButton>
            <BaseButton variant="primary" size="lg">Large</BaseButton>
            <BaseButton variant="primary" size="xl">XL</BaseButton>
          </div>
          
          <div class="flex flex-wrap gap-3">
            <BaseButton variant="primary" :loading="isLoading" @click="toggleLoading">
              {{ isLoading ? 'Loading...' : 'Toggle Loading' }}
            </BaseButton>
            <BaseButton variant="secondary" disabled>Disabled</BaseButton>
            <BaseButton variant="primary" icon-only rounded="full">
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </template>
            </BaseButton>
          </div>
        </div>
      </section>

      <!-- Game Cards Section -->
      <section class="card-base p-6">
        <h2 class="text-responsive-lg font-semibold mb-6">Game Cards</h2>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-responsive-base font-medium mb-3">Individual Cards</h3>
            <div class="flex flex-wrap gap-4 mb-4">
              <GameCard
                v-for="card in demoCards"
                :key="`${card.suit}-${card.rank}`"
                :rank="card.rank"
                :suit="card.suit"
                :selected="selectedCards.includes(card.id)"
                @click="selectCard(card)"
              />
            </div>
            
            <h4 class="text-responsive-sm font-medium mb-3">Card Back Colors</h4>
            <div class="flex flex-wrap gap-4">
              <div v-for="color in cardBackColors" :key="color" class="text-center">
                <GameCard
                  rank="A"
                  suit="spades"
                  :back-color="color"
                  :flipped="true"
                  size="sm"
                />
                <p class="text-xs mt-1 capitalize">{{ color }}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-responsive-base font-medium mb-3">Card Hand (Fan Layout)</h3>
            <CardHand
              :cards="handCards"
              layout="fan"
              size="md"
              @card-select="handleCardSelect"
              @selection-change="updateHandSelection"
            >
              <template #actions="{ selectedCards: selected, handActions }">
                <div class="flex gap-2 justify-center">
                  <BaseButton size="sm" variant="secondary" @click="handActions.selectAll">
                    Select All
                  </BaseButton>
                  <BaseButton size="sm" variant="ghost" @click="handActions.deselectAll">
                    Clear
                  </BaseButton>
                </div>
              </template>
            </CardHand>
          </div>
        </div>
      </section>

      <!-- Game UI Section -->
      <section class="card-base p-6">
        <h2 class="text-responsive-lg font-semibold mb-6">Game UI Components</h2>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-responsive-base font-medium mb-3">Health Bars</h3>
            <div class="space-y-4 max-w-md">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium">Health</span>
                  <span class="text-sm">{{ playerHealth }}/100</span>
                </div>
                <HealthBar
                  :value="playerHealth"
                  :max-value="100"
                  variant="health"
                  show-warning
                  animated
                />
                <div class="flex gap-2 mt-2">
                  <BaseButton size="xs" @click="changeHealth(-20)">-20</BaseButton>
                  <BaseButton size="xs" @click="changeHealth(20)">+20</BaseButton>
                  <BaseButton size="xs" @click="playerHealth = 100">Full</BaseButton>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium">Mana</span>
                  <span class="text-sm">{{ playerMana }}/100</span>
                </div>
                <HealthBar
                  :value="playerMana"
                  :max-value="100"
                  variant="mana"
                  animated
                />
              </div>
              
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium">Experience</span>
                  <span class="text-sm">{{ playerExp }}/500</span>
                </div>
                <HealthBar
                  :value="playerExp"
                  :max-value="500"
                  variant="experience"
                  animated
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-responsive-base font-medium mb-3">Score Display</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div class="text-center">
                <ScoreDisplay
                  :value="playerScore"
                  label="Score"
                  format="comma"
                  animated
                  show-change-indicator
                />
                <BaseButton size="sm" class="mt-2" @click="addScore(100)">
                  +100 Points
                </BaseButton>
              </div>
              
              <div class="text-center">
                <ScoreDisplay
                  :value="playerLevel"
                  label="Level"
                  variant="primary"
                  animated
                />
                <BaseButton size="sm" class="mt-2" @click="playerLevel++">
                  Level Up
                </BaseButton>
              </div>
              
              <div class="text-center">
                <ScoreDisplay
                  :value="timeRemaining"
                  label="Time"
                  suffix="s"
                  variant="warning"
                  animated
                />
                <BaseButton size="sm" class="mt-2" @click="startTimer">
                  Start Timer
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Modals Section -->
      <section class="card-base p-6">
        <h2 class="text-responsive-lg font-semibold mb-6">Modals</h2>
        
        <div class="flex flex-wrap gap-3">
          <BaseButton @click="showBasicModal = true">Basic Modal</BaseButton>
          <BaseButton variant="secondary" @click="showConfirmModal = true">Confirmation</BaseButton>
          <BaseButton variant="danger" @click="showGameOverModal = true">Game Over</BaseButton>
        </div>
      </section>

      <!-- Interactive Demo -->
      <section class="card-base p-6">
        <h2 class="text-responsive-lg font-semibold mb-6">Interactive Card Game Demo</h2>
        
        <div class="space-y-6">
          <div class="flex flex-wrap gap-4 justify-center">
            <BaseButton @click="dealNewHand" variant="primary">Deal New Hand</BaseButton>
            <BaseButton @click="shuffleCards" variant="secondary">Shuffle</BaseButton>
            <BaseButton @click="flipAllCards" variant="ghost">Flip All</BaseButton>
            <BaseButton @click="resetDemo" variant="outline">Reset Demo</BaseButton>
          </div>
          
          <div class="text-center">
            <p class="text-responsive-sm text-[var(--color-text-secondary)] mb-4">
              Selected: {{ selectedHandCards.length }} cards | 
              Score: {{ playerScore.toLocaleString() }} | 
              Level: {{ playerLevel }}
            </p>
          </div>
          
          <CardHand
            :cards="gameHandCards"
            layout="fan"
            size="lg"
            :show-hand-info="true"
            @card-select="handleGameCardSelect"
            @selection-change="updateGameSelection"
          >
            <template #actions="{ selectedCards, handActions }">
              <div class="flex gap-2 justify-center">
                <BaseButton 
                  size="sm" 
                  variant="secondary" 
                  :disabled="selectedCards.length === 0"
                  @click="playSelectedCards"
                >
                  Play Cards ({{ selectedCards.length }})
                </BaseButton>
                <BaseButton size="sm" variant="ghost" @click="handActions.deselectAll">
                  Clear Selection
                </BaseButton>
              </div>
            </template>
          </CardHand>
        </div>
      </section>
    </div>

    <!-- Modals -->
    <BaseModal
      :is-open="showBasicModal"
      title="Basic Modal Example"
      @close="showBasicModal = false"
    >
      <p class="mb-4">
        This is a basic modal with theme-aware styling and accessibility features.
      </p>
      <p class="text-sm text-[var(--color-text-secondary)]">
        Try pressing Escape to close, or clicking the backdrop.
      </p>
      
      <template #footer>
        <BaseButton variant="secondary" @click="showBasicModal = false">
          Cancel
        </BaseButton>
        <BaseButton @click="showBasicModal = false">
          Confirm
        </BaseButton>
      </template>
    </BaseModal>

    <BaseModal
      :is-open="showConfirmModal"
      title="Confirm Action"
      size="sm"
      @close="showConfirmModal = false"
    >
      <p class="mb-4">Are you sure you want to discard all selected cards?</p>
      
      <template #footer>
        <BaseButton variant="secondary" @click="showConfirmModal = false">
          Cancel
        </BaseButton>
        <BaseButton variant="danger" @click="confirmDiscard">
          Discard Cards
        </BaseButton>
      </template>
    </BaseModal>

    <BaseModal
      :is-open="showGameOverModal"
      title="Game Over!"
      size="md"
      @close="showGameOverModal = false"
    >
      <div class="text-center py-4">
        <div class="text-4xl mb-4">🎉</div>
        <ScoreDisplay
          :value="playerScore"
          label="Final Score"
          format="comma"
          size="xl"
          variant="success"
        />
        <p class="text-[var(--color-text-secondary)] mt-4">
          You reached level {{ playerLevel }}!
        </p>
      </div>
      
      <template #footer>
        <BaseButton variant="secondary" @click="showGameOverModal = false">
          Menu
        </BaseButton>
        <BaseButton @click="restartGame">
          Play Again
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from './composables/useTheme.js'

export default {
  name: 'App',
  setup() {
    // Theme management
    const { theme, cycleTheme, isDark } = useTheme()
    
    // Component state
    const isLoading = ref(false)
    const selectedCards = ref([])
    const selectedHandCards = ref([])
    const selectedGameCards = ref([])
    
    // Game state
    const playerHealth = ref(75)
    const playerMana = ref(60)
    const playerExp = ref(340)
    const playerScore = ref(12450)
    const playerLevel = ref(5)
    const timeRemaining = ref(180)
    
    // Modal state
    const showBasicModal = ref(false)
    const showConfirmModal = ref(false)
    const showGameOverModal = ref(false)
    
    // Demo cards
    const demoCards = ref([
      { id: 1, rank: 'A', suit: 'hearts' },
      { id: 2, rank: 'K', suit: 'spades' },
      { id: 3, rank: 'Q', suit: 'diamonds' },
      { id: 4, rank: 'J', suit: 'clubs' }
    ])
    
    const handCards = ref([
      { id: 5, rank: '10', suit: 'hearts' },
      { id: 6, rank: 'J', suit: 'hearts' },
      { id: 7, rank: 'Q', suit: 'hearts' },
      { id: 8, rank: 'K', suit: 'hearts' },
      { id: 9, rank: 'A', suit: 'hearts' }
    ])
    
    const gameHandCards = ref([
      { id: 10, rank: '7', suit: 'spades', flipped: false },
      { id: 11, rank: '8', suit: 'diamonds', flipped: false },
      { id: 12, rank: '9', suit: 'clubs', flipped: false },
      { id: 13, rank: '10', suit: 'hearts', flipped: false },
      { id: 14, rank: 'J', suit: 'spades', flipped: false },
      { id: 15, rank: 'Q', suit: 'diamonds', flipped: false }
    ])
    
    // Card back colors for demo
    const cardBackColors = ref(['blue', 'gray', 'green', 'purple', 'red', 'yellow'])
    
    // Computed properties
    const themeIcon = computed(() => {
      if (theme.value === 'system') return '🔄'
      return isDark.value ? '🌙' : '☀️'
    })
    
    const themeLabel = computed(() => {
      const labels = {
        light: 'Light',
        dark: 'Dark',
        system: 'Auto'
      }
      return labels[theme.value]
    })
    
    // Methods
    const toggleLoading = () => {
      isLoading.value = !isLoading.value
      if (isLoading.value) {
        setTimeout(() => {
          isLoading.value = false
        }, 2000)
      }
    }
    
    const selectCard = (card) => {
      const index = selectedCards.value.indexOf(card.id)
      if (index > -1) {
        selectedCards.value.splice(index, 1)
      } else {
        selectedCards.value.push(card.id)
      }
    }
    
    const handleCardSelect = (event) => {
      console.log('Card selected:', event)
    }
    
    const updateHandSelection = (selection) => {
      selectedHandCards.value = selection
    }
    
    const handleGameCardSelect = (event) => {
      console.log('Game card selected:', event)
    }
    
    const updateGameSelection = (selection) => {
      selectedGameCards.value = selection
    }
    
    const changeHealth = (amount) => {
      playerHealth.value = Math.max(0, Math.min(100, playerHealth.value + amount))
    }
    
    const addScore = (points) => {
      playerScore.value += points
    }
    
    const startTimer = () => {
      if (timeRemaining.value <= 0) {
        timeRemaining.value = 180
      }
      
      const timer = setInterval(() => {
        timeRemaining.value--
        if (timeRemaining.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    }
    
    const dealNewHand = () => {
      const suits = ['hearts', 'diamonds', 'clubs', 'spades']
      const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
      
      const newHand = []
      for (let i = 0; i < 6; i++) {
        const suit = suits[Math.floor(Math.random() * suits.length)]
        const rank = ranks[Math.floor(Math.random() * ranks.length)]
        newHand.push({
          id: Date.now() + i,
          rank,
          suit,
          flipped: false
        })
      }
      
      gameHandCards.value = newHand
      selectedGameCards.value = []
    }
    
    const shuffleCards = () => {
      const shuffled = [...gameHandCards.value]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      gameHandCards.value = shuffled
    }
    
    const flipAllCards = () => {
      gameHandCards.value = gameHandCards.value.map(card => ({
        ...card,
        flipped: !card.flipped
      }))
    }
    
    const playSelectedCards = () => {
      if (selectedGameCards.value.length > 0) {
        addScore(selectedGameCards.value.length * 50)
        
        // Remove played cards from hand
        const playedIds = selectedGameCards.value.map(card => card.id || card)
        gameHandCards.value = gameHandCards.value.filter(card => 
          !playedIds.includes(card.id)
        )
        
        selectedGameCards.value = []
      }
    }
    
    const confirmDiscard = () => {
      if (selectedGameCards.value.length > 0) {
        const discardedIds = selectedGameCards.value.map(card => card.id || card)
        gameHandCards.value = gameHandCards.value.filter(card => 
          !discardedIds.includes(card.id)
        )
        selectedGameCards.value = []
      }
      showConfirmModal.value = false
    }
    
    const resetDemo = () => {
      playerHealth.value = 100
      playerMana.value = 100
      playerExp.value = 0
      playerScore.value = 0
      playerLevel.value = 1
      timeRemaining.value = 180
      selectedCards.value = []
      selectedHandCards.value = []
      selectedGameCards.value = []
      dealNewHand()
    }
    
    const restartGame = () => {
      resetDemo()
      showGameOverModal.value = false
    }
    
    // Initialize on mount
    onMounted(() => {
      dealNewHand()
    })
    
    return {
      // Theme
      theme,
      cycleTheme,
      isDark,
      themeIcon,
      themeLabel,
      
      // Component state
      isLoading,
      selectedCards,
      selectedHandCards,
      selectedGameCards,
      
      // Game state
      playerHealth,
      playerMana,
      playerExp,
      playerScore,
      playerLevel,
      timeRemaining,
      
      // Modal state
      showBasicModal,
      showConfirmModal,
      showGameOverModal,
      
      // Demo data
      demoCards,
      handCards,
      gameHandCards,
      cardBackColors,
      
      // Methods
      toggleLoading,
      selectCard,
      handleCardSelect,
      updateHandSelection,
      handleGameCardSelect,
      updateGameSelection,
      changeHealth,
      addScore,
      startTimer,
      dealNewHand,
      shuffleCards,
      flipAllCards,
      playSelectedCards,
      confirmDiscard,
      resetDemo,
      restartGame
    }
  }
}
</script>