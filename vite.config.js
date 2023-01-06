import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/bug-hunter',
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/**',
          dest: 'assets',
        },
      ],
    }),
  ],
});
