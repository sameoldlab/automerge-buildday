// import { defineConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import { sveltekit } from '@sveltejs/kit/vite'
import wasm from 'vite-plugin-wasm'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [wasm(), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
  worker: {
    format: 'es',
    plugins: () => [wasm()],
  },
})