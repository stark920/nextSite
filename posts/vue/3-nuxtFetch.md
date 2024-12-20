---
title: '了解 Nuxt 中 Data Fetching (API 串接)'
date: '2024-12-19'
description: '本篇文章根據官方文件的說明解說 useFetch, useAsyncData 和 $fetch 之間的差異和運用。'
tags: 'Vue,Nuxt,Api,Data Fetching,Fetch'
---

# 前言
Nuxt 提供 3 種 Data Fetching (打 API) 的方法，`useFetch`, `useAsyncData` 和 `$fetch`。

在選擇使用哪個方法之前，我們需要先有基本的認知：
Nuxt 區分 Server Side 和 Client Side，程式碼會在兩端都執行一次，如果兩次打 API 的回傳資料不同，就可能造成最後渲染結果不一致（Hydration issue），所以串 API 前需要先確認我們希望 Nuxt 怎麼做？
1. SSR：
    - 在 Server Side 的結果為主，Client Side 不再打 API，延用 Server Side 拿到的資料。
    - 以 Client Side 的結果為主。
2. CSR：同 Vue 一樣只有 Client Side 會處理。

有別於官方文件依序介紹 `useFetch`, `useAsyncData` 和 `$fetch` 三個方法，本文中會依據使用情境來介紹。
> 有能力的話還是建議花時間完整讀完[官方文件](https://nuxt.com/docs/getting-started/data-fetching)，篇幅雖長，但是講的內容非常詳細。

---
# 基本操作

## $fetch

`$fetch` 本身是 [ofetch](https://github.com/unjs/ofetch) 這個套件，在 Nuxt 中不需要額外 import，直接使用 `$fetch` 即可。

`$fetch` 屬於 **SSR** 中的 **以 Client Side 的結果為主**，通常用於畫面操作，例如：新增資料、送出表單...等。

```js
// 官方文件範例 https://nuxt.com/docs/getting-started/data-fetching#fetch
<script setup lang="ts">
async function addTodo() {
  const todo = await $fetch('/api/todos', {
    method: 'POST',
    body: {
      // My todo data
    }
  })
}
</script>
```

## useFetch

`useFetch` 是結合 `$fetch` 和 `useAsyncData` 封裝的語法糖。

`useFetch` 屬於 **SSR** 中的 **以 Server Side 的結果為主**，通常用於會影響首次渲染畫面內容的資料。

```js
// 官方文件範例 https://nuxt.com/docs/getting-started/data-fetching#usefetch
<script setup lang="ts">
const { data: count } = await useFetch('/api/count')
</script>

<template>
  <p>Page visits: {{ count }}</p>
</template>
```

## useFetch (Client Side Only)

`useFetch` 方法可以把 server 設定關閉，如此一來就不會在 Server Side 執行，如果這支 API 和畫面沒有任何關聯，不影響 SEO 就可以使用這個方式。

```js
// 官方文件範例 https://nuxt.com/docs/getting-started/data-fetching#client-only-fetching
const { status, data: comments } = useFetch('/api/comments', {
  lazy: true, // lazy 的功用在下面章節說明
  server: false
})
```

## 結合使用

以下範例程式碼被放在官方文件的最上方，但了解運作後再回來看會更清楚。

這個範例模擬了一個 `表單` 和 `沒有資料` 的畫面切換，邏輯如下：
1. 先打 API (/api/data) 確認有沒有資料，有的話就顯示`表單`內容，沒有的話就顯示`沒有資料`。
2. 使用 **useFetch** 在 Server Side 確認結果（data），將結果傳給 Client Side。
3. 瀏覽器不會再執行 **useFetch**，直接依據 Server Side 取得的結果渲染畫面。
4. 兩種渲染結果
    - 無資料，顯示`沒有資料`
    - 有資料，顯示`表單`內容，並且使用 **$fetch** 來送出表單。

```js
// 官方文件範例 https://nuxt.com/docs/getting-started/data-fetching#useasyncdata
<script setup lang="ts">
const { data } = await useFetch('/api/data')

async function handleFormSubmit() {
  const res = await $fetch('/api/submit', {
    method: 'POST',
    body: {
      // My form data
    }
  })
}
</script>

<template>
  <div v-if="data == null">
    No data
  </div>
  <div v-else>
    <form @submit="handleFormSubmit">
      <!-- form input tags -->
    </form>
  </div>
</template>
```

---
# 進階操作

## useAsyncData

會歸類在進階操作主要是因為 `useFetch` 可以應付大多數的情境，當要進行比較複雜的操作，才會使用 `useAsyncData`。

顧名思義，只要是非同步資料都可寫在 `useAsyncData` 方法中，下方的官方範例中，用 Promise.all 一次操作多個 API 回傳資料，再用 `useAsyncData` 包起來就可以用 Nuxt 的方式去執行它。

方法中帶的第一個參數是用來辨識用的 `key`（就像 pinia 中每個 store 也要寫上辨識用的名稱），第二個參數就可以自由的撰寫你的程式邏輯（`useFetch` 就是在這邊包了一個 `$fetch`）。

```js
// 官方文件範例 https://nuxt.com/docs/getting-started/data-fetching#useasyncdata
<script setup lang="ts">
const { data: discounts, status } = await useAsyncData('cart-discount', async () => {
  const [coupons, offers] = await Promise.all([
    $fetch('/cart/coupons'),
    $fetch('/cart/offers')
  ])

  return { coupons, offers }
})
</script>
```

---
# 流程控制

Nuxt 的 data-fetching 有許多設定（options）可以調整運作行為和時機。

## lazy

早期 Nuxt 的官方文件另外寫了 `useLazyFetch` 和 `useLazyAsyncData` 兩個章節（現在則是寫在 `lazy` 章節中），其實這不是什麼特別的方法，只是在原本的 `useFetch` 和 `useAsyncData` 中預設開啟了 `lazy` 參數，兩種寫法都通用。

Nuxt 在頁面切換時，非同步處理的程式會觸發 `<Suspense>` 來顯示 loading 效果，如果希望自己控制 loading 效果不要觸發 `<Suspense>`，就可以開啟這個參數。

> Suspense 這個元件卡在 experiment 非常久的時間了，到底要不要用見仁見智。

```js
// 官方文件範例 https://nuxt.com/docs/getting-started/data-fetching#lazy
const { status, data: posts } = useFetch('/api/posts', {
  lazy: true
})

const { data, error } = await useAsyncData(`user:${id}`, () => {
  return myGetFunction('users', { id })
}, {
  lazy: true
})
```

## server

在上面的基本介紹有提到，這個設定可以關閉 Server Side 的執行，只有 Client Side 會執行。

## immediate

預設執行時就會觸發 api 請求，所以像點擊之類的操作需要包一層 function，裡面再執行 fetching 方法，而 `immediate` 可以關閉這個預設行為，另外從 fetching 方法中解構出 `execute` 來觸發請求。

```js
const { execute, data } = useFetch('/api/example', {
  lazy: true,
  server: false,
  immediate: false
})

const callApi = () => execute();
```

# 資料格式

## Pick or Transform

> 這兩個不能同時使用！

`pick` 和 `transform` 都是用來改造回傳資料的設定（options），`pick` 單純選擇需要的 Key-Value，`transform` 可以進一步修改回傳格式。

```js
// 官方文件範例 https://nuxt.com/docs/getting-started/data-fetching#minimize-payload-size
// pick
const { data: mountain } = await useFetch('/api/mountains/everest', {
  pick: ['title', 'description']
})

// transform
const { data: mountains } = await useFetch('/api/mountains', {
  transform: (mountains) => {
    return mountains.map(mountain => ({ title: mountain.title, description: mountain.description }))
  }
})
```

## TypeScript
`$fetch` 和 `useFetch` 在 Typescript 中都可以使用泛型來標示回傳資料的型別。

```js
const data = $fetch<number>('/api/example');
// 推導型別：Promise<number>

const { data } = useFetch<MyType>('/api/example');
// 推導型別：globalThis.Ref<MyType | null>

const { data } = await useAsyncData(
  'cart-discount',
  async () => {
    const [coupons, offers] = await Promise.all([
      $fetch<number>('/cart/coupons'),
      $fetch<string>('/cart/offers')
    ]);

    return { coupons, offers };
  },
  {
    pick: ['coupons']
  }
);
// 推導型別：
// globalThis.Ref<Pick<{
//   coupons: number;
//   offers: string;
// }, "coupons"> | null>
```

---
# Interceptors (攔截器)

如同其他的 API Library，Nuxt 提供的方法中也有 `onRequest`, `onRequestError`, `onResponse`, `onResponseError` 這些 hook 可以進行二次封裝。

---
# 結語

Nuxt 開發時串接 API 需要考量 Server Side 和 Client Side 的場景，不像 Vue 相對單純，但是需求文件不會標示該怎麼做，做為開發者需要自己多思考一下該如何處理較合理，而 `useFetch` 和 `$fetch` 就是你的得力助手，不夠用時再動用 `useAsyncData` 即可。