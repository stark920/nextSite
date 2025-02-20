---
title: 'Vue3 + Vite + Storybook + TailwindCSS + I18n 設定'
date: '2025-01-01'
description: 'Storybook 就像是前端的 Swagger，是前端元件庫的說明文件，因為前端環境非常多元，導入 Storybook 還需要一些設定才能符合專案需求。'
tags: 'Vue3,Vite,Storybook,TailwindCSS,I18n'
---

# 前言
> Storybook 不同版本間可用的方法或檔案結構都有改動，若是發現文章內容無法使用，很可能就是版本在搞，本篇文章使用 Storybook 版本是 8.4

Storybook 就像是前端的 Swagger，是前端元件庫的說明文件，但是現在前端環境非常多元，目錄結構也很彈性，不像後端的一些模版可以自動生成 Swagger，畫面加上邏輯的複雜度也是相對高上許多，需要花點時間設定 Storybook，才能符合專案需求。

導入 Storybook 的時間成本其實不低，如果是趕工、接案各種隕石開發、諸神黃昏的情境不太建議導入，需求變化的速度決定 Storybook 荒廢的速度。

可以在 [DEMO](https://storybook-static-ivory-theta.vercel.app/) 觀看本文的最後成果，也可以直接下載 [Repo](https://github.com/stark920/vue-storybook-starter) 來修改。

---
# 基本環境建置

這部份不是本文重點，簡單帶過。

## Vue
照[官方文件](https://vuejs.org/guide/quick-start.html)或是自己的方式建立。

```sh
# npm
npm create vue@latest

# pnpm
pnpm create vue@latest

# yarn
yarn create vue@latest

# bun
bun create vue@latest
```

## Vue-I18n

安裝指令

```sh
# npm
npm install vue-i18n@10

# pnpm
pnpm add vue-i18n@10

# yarn
yarn add vue-i18n@10

# bun
bun add vue-i18n@10
```

> 安裝後需要照 [官方文件](https://vue-i18n.intlify.dev/guide/installation.html) 或是自己的方式完成其他的設定。

## Tailwind

本文使用 Vite，故參考 [Vite+Vue 官方文件](https://tailwindcss.com/docs/guides/vite) 來安裝。

```sh
# Vite 已經有 postcss 不需要額外安裝

# npm
npm install -D tailwindcss autoprefixer
npx tailwindcss init -p

# bun
bun add -d tailwindcss autoprefixer
bunx tailwindcss init -p
```

> 安裝後需要照官方文件或是自己的方式完成其他的設定。

---
# Storybook

## 安裝
照 [官方文件](https://storybook.js.org/docs/get-started/install) 執行指令即可。

```sh
# npm
npx storybook@latest init

# pnpm
pnpm dlx storybook@latest init

# yarn
yarn dlx storybook@latest init

# bun
bunx storybook@latest init
```

安裝完成後如果已經會寫 stories 不需要參考範例，可以把 `stories` 資料夾刪除，除此之外也可以把導覽用的 addon 移除。

```js
// .storybook/main.ts

// ...
const config: StorybookConfig = {
  // ...
  addons: [
    // '@storybook/addon-onboarding', 這行刪除或註解
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  // ...
}
```

## 整合 Tailwind

只要找到 `.storybook/preview.ts` 這個設定檔，在上方引用 tailwind 的 css 入口檔案即可。

```js
// .storybook/preview.ts

import '[your-path]/(tailwind|index|main|style).css'
```

## 加入 DarkMode 切換

先完成 Tailwind 的 DarkMode 設定，Storybook 有兩種設定方式 `class` 和 `data-attribute`，本文使用 `class`，`data-attribute` 可以參考 [官方文件 - Add a theme switcher tool](https://storybook.js.org/recipes/tailwindcss#3-add-a-theme-switcher-tool)。

```js
// tailwind.config.js

module.exports = {
  darkMode: 'class',
  // ...
}
```

安裝主題套件

```sh
# npm
npx storybook@latest add @storybook/addon-themes

# bun
bunx storybook@latest add @storybook/addon-themes
```

修改 `.storybook/preview.js`

```js
// .storybook/preview.ts

import { withThemeByClassName } from '@storybook/addon-themes'
 
export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
]
```

## DarkMode 進階

如果前面步驟都順利成功完成，會發現 Storybook 的主題切換是針對元件而已，頁面底色是獨立的狀態，當底色是 Light Mode 但是元件是 Dark Mode 就很可能會看不清楚，切換一次需要點兩次非常麻煩。Storybook 認為主題色本就是針對元件，這個功能還在討論階段，只能靠自己實現了，而實現的關鍵就是運用 CSS Variables。

1. 在 `(tailwind|index|main|style).css ` 中加入 CSS 變數。

```css
/* (tailwind|index|main|style).css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
	:root {
		--sb-background: 0 0% 100%;
	}

	.dark {
		--sb-background: 222.2 84% 4.9%;
	}
}
```

2. 修改 `tailwind.config.js`，把 `dark` 加入 `safelist`。

```js
// tailwind.config.js

export default {
  // ...
  darkMode: 'class',
  // Tailwind purge 預設會忽略 dark，所以要加入 safelist
  safelist: ['dark'],
  // ...
}
```

3. 修改 `.storybook/preview.ts`，把背景設定到對應的 CSS Variable。

```js
// .storybook/preview.ts

const preview: Preview = {
  parameters: {
    // ...
    backgrounds: {
      default: 'default',
      values: [
        { name: 'default', value: 'hsl(var(--sb-background))' },
      ]
    }
  },
}
```

4. 完成，測試成果。

## 整合 I18n

如果想放到 Storybook 的元件已經綁定了 `t` 的多國語系文字，又想要測試文字是否正常，會發現執行階段錯誤，我們可以在 Storybook 中另外加入 vue-i18n 的引用，並且新增語系切換的按鈕。

1. 調整 i18n 主要設定檔（這部份僅供參考，視專案自行調整設計）
```js
// i18n.ts
import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    message: {
      hello: 'Hello'
    }
  },
  'zh-TW': {
    message: {
      hello: '你好'
    }
  }
}

export type Locale = keyof typeof messages

export const availableLocales = Object.keys(messages) as Locale[]

const i18n = createI18n({
  locale: 'zh-TW',
  fallbackLocale: 'en',
  messages
})

export default i18n
```

2. 修改 `.storybook/preview.ts`，引入 i18n 和新增 decorators。
```js
// .storybook/preview.ts

import { type Preview, setup } from '@storybook/vue3'
import { ref } from 'vue'
import i18n, { availableLocales } from '../src/i18n'

setup(app => app.use(i18n))

const locale = ref<typeof availableLocales[number]>('en')

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Global locale for i18n',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: availableLocales.map(locale => ({ value: locale, title: locale })),
    },
  },
}

export const decorators = [
  // ...
  (story, context) => {
    locale.value = context.globals.locale
    i18n.global.locale = locale.value // Dynamically set the locale
    return story()
  },
]
```

3. 完成，測試成果。
