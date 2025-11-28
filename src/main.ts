import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import { inject } from '@vercel/analytics'

import App from './App.vue'
import router from './router'
import '@/styles/main.css'

const app = createApp(App)
const head = createHead()

app.use(createPinia())
app.use(router)
app.use(head)

app.mount('#app')

// Initialize Vercel Analytics
inject()
