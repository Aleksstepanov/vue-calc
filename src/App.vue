<template>
  <div class="container">
    <div class="calc" role="application" aria-label="Калькулятор">
      <div class="display" aria-live="polite">{{ display }}</div>
      <div class="grid" @keydown="onKeyDown" tabindex="0">
        <button class="btn clr" @click="clearAll">C</button>
        <button class="btn" @click="backspace">⌫</button>
        <button class="btn" @click="inputDot">.</button>
        <button class="btn op" @click="chooseOp('/')">÷</button>

        <button class="btn" @click="inputDigit('7')">7</button>
        <button class="btn" @click="inputDigit('8')">8</button>
        <button class="btn" @click="inputDigit('9')">9</button>
        <button class="btn op" @click="chooseOp('*')">×</button>

        <button class="btn" @click="inputDigit('4')">4</button>
        <button class="btn" @click="inputDigit('5')">5</button>
        <button class="btn" @click="inputDigit('6')">6</button>
        <button class="btn op" @click="chooseOp('-')">−</button>

        <button class="btn" @click="inputDigit('1')">1</button>
        <button class="btn" @click="inputDigit('2')">2</button>
        <button class="btn" @click="inputDigit('3')">3</button>
        <button class="btn op" @click="chooseOp('+')">+</button>

        <button class="btn" style="grid-column: span 2" @click="inputDigit('0')">0</button>
        <button class="btn" @click="toggleSign">±</button>
        <button class="btn eq" @click="equals">=</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Op = '+' | '-' | '*' | '/' | null

const display = ref('0')
const first = ref<number | null>(null)
const op = ref<Op>(null)
const fresh = ref<boolean>(true) // true => следующая цифра заменит дисплей

const inputDigit = (d: string) => {
  if (fresh.value || display.value === '0') {
    display.value = d
    fresh.value = false
  } else {
    display.value += d
  }
}

const inputDot = () => {
  if (fresh.value) {
    display.value = '0.'
    fresh.value = false
  } else if (!display.value.includes('.')) {
    display.value += '.'
  }
}

const toNum = () => {
  const n = Number(display.value)
  return Number.isFinite(n) ? n : 0
}

const chooseOp = (next: Exclude<Op, null>) => {
  if (op.value && !fresh.value && first.value !== null) {
    // цепочка операций: вычислим предыдущее
    const res = compute(first.value, toNum(), op.value)
    display.value = format(res)
    first.value = res
  } else {
    first.value = toNum()
  }
  op.value = next
  fresh.value = true
}

const compute = (a: number, b: number, oper: Exclude<Op, null>) => {
  switch (oper) {
    case '+': return a + b
    case '-': return a - b
    case '*': return a * b
    case '/': return b === 0 ? NaN : a / b
  }
}

const format = (n: number) => {
  if (!Number.isFinite(n)) return 'Ошибка'
  const s = n.toString()
  // Уберём лишние нули после запятой
  if (s.includes('e') || s.includes('E')) return s
  const fixed = Number.parseFloat(n.toFixed(12)) // отсечём артефакты float
  return String(fixed)
}

const equals = () => {
  if (op.value && first.value !== null) {
    const res = compute(first.value, toNum(), op.value)
    display.value = format(res)
    first.value = null
    op.value = null
    fresh.value = true
  }
}

const clearAll = () => {
  display.value = '0'
  first.value = null
  op.value = null
  fresh.value = true
}

const backspace = () => {
  if (fresh.value) return
  if (display.value.length <= 1) {
    display.value = '0'
    fresh.value = true
  } else {
    display.value = display.value.slice(0, -1)
  }
}

const toggleSign = () => {
  if (display.value === '0' || display.value === 'Ошибка') return
  if (display.value.startsWith('-')) {
    display.value = display.value.slice(1)
  } else {
    display.value = '-' + display.value
  }
}

const onKeyDown = (e: KeyboardEvent) => {
  const k = e.key
  if (/[0-9]/.test(k)) inputDigit(k)
  else if (k === '.') inputDot()
  else if (k === '+' || k === '-' || k === '*' || k === '/') chooseOp(k as any)
  else if (k === 'Enter' || k === '=') equals()
  else if (k === 'Backspace') backspace()
  else if (k.toLowerCase() === 'c') clearAll()
}
</script>
