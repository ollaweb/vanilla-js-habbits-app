import legacy from '@vitejs/plugin-legacy';
import { fileURLToPath, URL } from "url";

export default {
    plugins: [
        legacy({
            targets: ['last 2 versions and not dead, > 0.3%, Firefox ESR'],
        }),
    ],
    resolve: {
        alias: [
            { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
            { find: '~', replacement: fileURLToPath(new URL('./', import.meta.url)) },
        ],
    },
}