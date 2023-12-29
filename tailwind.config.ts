import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          '100': '#F9F7F6',
          '200': '#E6E2DF',
          '300': '#DFDBD8',
          '350': '#CFCBC8',
          '400': '#A9A7A6',
          '500': '#7F7E7D',
          '600': '#5b5b5a',
          '800': '#2b2b2b',
        },
        orange: {
          '400': '#ed5627',
          '500': '#cf4a21',
        }
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
export default config
