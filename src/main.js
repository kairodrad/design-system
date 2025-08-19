import { createApp } from 'vue'
import App from './App.vue'
import CardGameDesignSystem from './index.js'

const app = createApp(App)

// Install the design system
app.use(CardGameDesignSystem)

app.mount('#app')