---
title: '如何在 Nuxt 中使用環境變數'
date: '2024-12-20'
description: 'Nuxt 的環境變數不是直接使用 dotenv，還要搭配 Runtime Config 設定才可以，除此之外還有個很類似的 App Config，都是需要額外學習的特有配置。'
tags: 'Vue,Nuxt,env,dotenv'
---

# 前言
Nuxt 的環境變數不是直接使用 dotenv，還要搭配 Runtime Config 設定才可以，除此之外還有個很類似的 App Config，都是需要額外學習的特有配置。

---
# dotenv (.env)

Nuxt 內建 **dotenv**，不需要額外安裝，把 `.env` 檔案放在專案的根目錄中即可。

```bash
# .env
MY_ENV_VARIABLE=hello
```

環境變數因為不同環境改變是很常見的情境，可以對應環境建置 .env 檔案，例如：

- `.env.local`
- `.env.stage`
- `.env.production`

接著在 `package.json` 中為每個環境的指令指定不同的 .env：

```json
// package.json
// ...
"scripts": {
  "dev": "nuxt dev --dotenv .env.local",
  "build:stage": "nuxt build --dotenv .env.stage",
  "build:production": "nuxt build --dotenv .env.production",
  // ...
}
```

---
# 上線環境 (Production)

Nuxt 專案 build 完後 **不會讀取 .env 檔案**，必須在執行環境設定環境變數，例如：
- 直接把變數加入執行指令（例如：`DB_HOST=xxxxxx node .output/server/index.mjs`）
- 在 `.bashrc` 或 `.profile` 等 shell 設定檔中設定環境變數。
- 雲端服務（例如：Vercel、Netlify 和 AWS）提供的環境變數設定介面。

---
# Runtime Config

Nuxt 使用 **runtimeConfig** 來設定環境變數，直接使用 **process.env.(變數名稱)** 很可能什麼都拿不到。

**runtimeConfig** 需要先在 `nuxt.config.ts` 中定義才可使用，區分兩種類型：
- Server-side Only：適合放不能暴露的機敏資訊，直接寫在 `runtimeConfig` 裡面即可。
- Server-side + Client-side：用來寫 Client Side 也需要用到的資訊（例如 API base url），需要將變數名稱放到子層 `public` 中。

```js
// nuxt.config.ts
// 官方範例：https://nuxt.com/docs/guide/going-further/runtime-config#exposing
export default defineNuxtConfig({
  runtimeConfig: {
    // The private keys which are only available within server-side
    apiSecret: '123',
    // Keys within public, will be also exposed to the client-side
    public: {
      apiBase: '/api'
    }
  }
})
```

完成 `nuxt.config.ts` 配置之後，就可以在頁面中使用 `useRuntimeConfig` 取得環境變數。

```js
// YourPage.vue
const runtimeConfig = useRuntimeConfig()

console.log(runtimeConfig.apiSecret) // Client-side 會顯示 undefined
console.log(runtimeConfig.public.apiBase)
```

## 結合 dotenv

Nuxt 會把特定名稱的環境變數匹配到對應的 Runtime Config 覆蓋，規則如下：

- `NUXT_PUBLIC_` 開頭對應到 runtimeConfig > public，後面的名稱轉為小寫開頭駝峰式命名（lower camel case）。
- `NUXT_`開頭對應到 runtimeConfig，後面的名稱轉為小寫開頭駝峰式命名（lower camel case）。

```bash
# .env
# 官方範例：https://nuxt.com/docs/guide/going-further/runtime-config#example
NUXT_API_SECRET=api_secret_token
NUXT_PUBLIC_API_BASE=https://nuxtjs.org
```

```js
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '', // 可以被 NUXT_API_SECRET 環境變數覆蓋
    public: {
      apiBase: '', // 可以被 NUXT_PUBLIC_API_BASE 環境變數覆蓋
    }
  },
})
```

## 變數命名問題

前面提到 Nuxt 會自動覆蓋特定名稱的變數，**嚴格來說是只對名稱符合規則的環境變數生效**，在下面的例子中，使用一個不符合規則的環境變數名稱，接續再說明不同階段下執行結果。

```bash
# .env
BASE_URL=default
```

```js
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.BASE_URL
    }
  },
})
```

各種情境下 runtimeConfig 中 public.apiBase 的取值結果：

1. **nuxt dev**： `default`，開發模式可以正常取值。
2. **BASE_URL=changed nuxt dev**: `changed`，開發模式可以正常覆蓋環境變數。
3. **nuxt build** + **node .output/server/index.mjs**： `default`，.env 的環境變數在 build 時一同打包，可以正常取值。
4. **nuxt build** + **BASE_URL=changed node .output/server/index.mjs**： `default`，覆蓋失敗，只有符合規則名稱的環境變數才能覆蓋。

從上面的結果可以知道，process.env 在 build 階段就被轉變成對應的靜態值了，後續需要符合 runtimeConfig 規則的名稱才動態覆蓋到對應的名稱，這也是為什麼 **嚴格來說是只對名稱符合規則的環境變數生效**，專案最後都要上線，開發時跑的很順，到上線才發現出問題可就緊張了。

---
# App Config

## 和 Runtime Config 的差異
從 [官方文件](https://nuxt.com/docs/getting-started/configuration#runtimeconfig-vs-appconfig) 來看，App Config 有幾個特點：

- 不能搭配 dotenv 修改（build 決定結果）。
- 可以設定各種型別的值，不限於原始型別。
- 不適合放敏感資訊（只適合放主題色系、標題這類全站配置）。

從實務角度來看：

- 之所以需要 dotenv + Runtime Config 不外乎兩個需求：
  1. 敏感資訊不想暴露。
  2. 可以在執行環境即時調整參數，不需要重新跑一次上版流程。

  這兩類資訊通常運用在程式邏輯中，我們通常也會把這些環境變數視為常數（readonly），把修改權限交給外部控制（Runtime Config 在程式內其實是可以被修改的，但這樣做會搞死人）。

- App Config 使用範圍在整個專案內（類似全域狀態配置），適合拿來放一些 UI 相關的參數，而且可以被安全的修改（例如主題色切換），如果需要擴充內容，就需要寫好新的參數，跑一次上版佈署來套用新的內容。

## App Config 使用方式

App Config 需要寫在獨立的 `app.config.ts` 檔案中，除此之外操作與 Runtime Config 沒有什麼差異。

```js
// app.config.ts
// 官方範例：https://nuxt.com/docs/guide/directory-structure/app-config#usage
export default defineAppConfig({
  title: 'Hello Nuxt',
  theme: {
    dark: true,
    colors: {
      primary: '#ff0000'
    }
  }
})
```

```js
// YourPage.vue
<script setup lang="ts">
const appConfig = useAppConfig()
</script>
```

---
# 結語
Runtime Config 和 App Config 看似都可以做到相同的事，但本質上還是有所不同，所以才會被設計成不同的功能，好好釐清需求才能挑選出最適合的操作方式。
> 一些網路文章把 ApiUrl 放在 App Config 中，個人覺得是不太合適的