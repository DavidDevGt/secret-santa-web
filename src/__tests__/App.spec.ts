import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'

describe('App', () => {
  it('mounts renders properly', () => {
    const pinia = createPinia()
    const router = createRouter({
      history: createWebHistory(),
      routes: []
    })

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
