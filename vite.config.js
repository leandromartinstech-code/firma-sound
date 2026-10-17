import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Caminhos relativos: o site funciona em qualquer endereço,
  // inclusive numa subpasta do GitHub Pages (usuario.github.io/nome-do-repositorio/).
  base: './',
});
