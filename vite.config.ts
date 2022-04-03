import { defineConfig } from 'vitest/config'
import packageJson from './package.json'
import vitePluginDts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib:{
      name: 'index',
      fileName: format => `index.${format}.js`,
      entry: 'src/index.ts',
      formats: ['cjs', 'es']
    },
    rollupOptions: {
       external: Object.keys(packageJson.dependencies),
    }
  },
  plugins: [
    vitePluginDts()
  ]
})