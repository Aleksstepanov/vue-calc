import { createApp } from 'vue'
import App from './App.vue'
import './styles/app.css'
// Подключаем пользовательские стили последними, чтобы они могли переопределить наши
import './styles/styles.css'

createApp(App).mount('#app')
