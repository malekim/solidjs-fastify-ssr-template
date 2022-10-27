import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import { resolve } from 'path'

export default defineConfig({
  plugins: [solid({ ssr: true }), typescriptPaths()],
  ssr: {
    noExternal: ['solid-meta']
  },
  assetsInclude: [/public\/.*$/],
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  resolve: {
    alias: {
      '@': resolve(process.cwd())
    }
  }
})
