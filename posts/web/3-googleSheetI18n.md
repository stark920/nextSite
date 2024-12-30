---
title: '使用 GoogleSheet 管理 i18n 字典檔'
description: '介紹如何使用 GoogleSheet 維護 i18n 字典檔，並建置指令快速同步到專案中。'
date: '2024-12-17'
tags: 'i18n,GoogleSheet,Internationalization'
---

# 前言
> 套件總是會出現重大改版，因為今年（2024）初要使用時發現許多範例已無法使用才有了這篇文章，可能幾年後這篇又不能用了。

多國語系（i18n）字典檔管理方式有最早期的後端管理、GoogleSheet 或其他付費第三方服務，使用 GoogleSheet 是低成本、快速又方便的作法。

工作流程大致如下：
1. 前端建置好 GoogleSheet 表單，填入 key 和基本文字。
2. 負責翻譯的人填入翻譯的文字。
3. 前端在專案中執行同步文字的指令檔更新 json 字典檔。
4. 上版佈署。

---
# 設定步驟

---
## 設定 GCP 

這個步驟最重要的是拿到 **私鑰** 和 **表單 ID**，操作步驟跟過去沒有太多差異，可以參考其他文章：

- [[重構倒數第20天] - i18n什麼的交給前端來處理吧(一) 把GoogleSheet文件轉成JSON文件 (by Mike)](https://ithelp.ithome.com.tw/articles/10262354)
- [【我可以你也可以的Node.js】第二三篇 - 蛤！原來串接 Google Sheet API 那麼簡單? (by Robin)](https://ithelp.ithome.com.tw/articles/10234325)

注意事項：
- 建立私鑰時請選擇 JSON 格式，並把私鑰放到專案中。
- 建議新增一個資料夾來存放私鑰，並且把路徑設定到 .gitignore 中，不要把私鑰一起上傳。
- 建立 google 表單後記得要調整使用權限，不然會連不進去。
- 表單 ID 是 google 表單網址後面那一大串 ({網址}/spreadsheets/d/{id})

---
## 設計 GoogleSheet 欄位

表單設計可以自由發揮（只要能寫得出讀取邏輯即可），本文設計第一列第一欄為 key，後面依序是各語系名稱，sheet 第一個是通用類文字，依據頁面或功能再擴充 sheet。

範例表單內容：

| key    | zh     | en     | jp       
| ------ | ------ | ------ | ------------
| home   | 首頁    | Home   | ホームページ

範例Sheet: 

common / about / feature

---
## 設計 json 檔案

本文設計將語系做為檔案名稱，每個 sheet 名稱為第一層，第二層才是 Key-Value pairs。

以上面的範例為例，最後會產出 zh.json, en.json, jp.json 這 3 個檔案，檔案內容大致如下：

```json
// zh.json
{
  "common": {
    "home": "首頁"
  },
  "about": {
    // ...
  },
  "feature": {
    // ...
  }
}
```

---
## 安裝套件

安裝讀取檔案和存取 googleSheet 的套件。

```bash
npm i -D fs-extra google-auth-library google-spreadsheet
```

---
## 撰寫執行檔

```js
// syncLang.js

import fs from 'fs-extra';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import path from 'path';
import { fileURLToPath } from 'url';

// =================== 基礎設定 ===================
const GOOGLE_SHEET_ID = '<your google sheet id>'; // Google 表單 ID
const CREDENTIAL_PATH = './(私鑰存放路徑)/(私鑰).json'; // Google 服務帳戶私鑰路徑
const OUTPUT_PATH = './locales'; // 輸出字典檔案的目錄

// 解析並設定檔案路徑
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const credentials = JSON.parse(fs.readFileSync(CREDENTIAL_PATH, 'utf8'));

console.log('---- 開始連接 Google Sheet ----');
console.log(new Date());

// =================== 驗證與初始化 Google 表單 ===================
const auth = new JWT({
  email: credentials.client_email, // 服務帳戶 email
  key: credentials.private_key, // 服務帳戶私鑰
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] // Google Sheet 讀取權限
});

// 初始化 Google 表單
const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, auth);
await doc.loadInfo();

console.log('---- Google Sheet 連接成功 ----');
console.log(new Date());
console.log('---- 開始產生字典檔 ----');

// =================== 資料處理邏輯 ===================

/**
 * 將特定語言的資料加入 JSON 結構
 * @param {string[][]} rows 二維陣列資料，代表表單行資料
 * @param {number} langIndex 語言欄位索引值
 * @param {string} langName 語言名稱 (例如: en, zh)
 * @param {string} pageTitle 當前表單標題
 * @param {object} resultStore 存放處理後的結果物件
 */
const appendLocaleToJSON = (rows, langIndex, langName, pageTitle, resultStore) => {
  // 初始化語言物件
  if (!resultStore[langName]) {
    resultStore[langName] = {};
  }
  // 初始化當前頁面標題物件
  if (!resultStore[langName][pageTitle]) {
    resultStore[langName][pageTitle] = {};
  }
  
  const currentPageData = resultStore[langName][pageTitle];

  // 遍歷每一行資料，將 key-value 加入對應語言的 JSON 結構
  rows.forEach(row => {
    currentPageData[row[0]] = row[langIndex];
  });
};

// =================== 讀取並處理表單資料 ===================

const localeResult = {}; // 存放所有語言的字典資料

// 遍歷每個分頁 (Sheet)
for (const sheet of doc.sheetsByIndex) {
  await sheet.loadHeaderRow(); // 載入表頭
  const { title: pageTitle, headerValues } = sheet;

  // 取得所有行資料
  const rows = await sheet.getRows();
  const rawData = rows.map(row => row._rawData); // 提取純資料

  // 逐一處理每個語言欄位
  for (let langIndex = 1; langIndex < headerValues.length; langIndex++) {
    const langName = headerValues[langIndex];
    appendLocaleToJSON(rawData, langIndex, langName, pageTitle, localeResult);
  }
}

// =================== 寫入 JSON 檔案 ===================

for (const [langName, data] of Object.entries(localeResult)) {
  const filePath = path.resolve(__dirname, OUTPUT_PATH, `${langName}.json`);
  
  // 寫入 JSON 檔案，並設定縮排
  fs.writeJSONSync(filePath, data, { spaces: 2 });
}

console.log('---- 字典檔產生完成 ----');
console.log(new Date());
```

---
## 加入執行指令

修改 package.json。（也可以不增加指令，直接用 node 執行）

```json
// package.json

{
  "scripts": {
    // ...
    "sync-lang": "node syncLang.js"
  },
  // ....
}
```

執行指令。

```bash
npm run sync-lang
```

> 也可以把語系同步加入自動化流程，但是隨著專案發展，文字越來越多會讓同步耗時增加，且可能有同事正在編輯，是不是要加入自動化需要自行評估。

---
# 延伸：GoogleTranslate

相信許多公司都有「老闆三不五時想新增語系，但根本沒有專人翻譯」的問題，這時候就可以用 GoogleTranslate 來自動翻譯，語法非常簡單：

`GOOGLETRANSLATE(text, [source_language, target_language])`

> 詳細語法請參考 [GOOGLETRANSLATE](https://support.google.com/docs/answer/3093331)

如果有使用 i18n 套件的變數功能，會遇到變數也一起被翻譯的問題，可以使用正則表達式搭配 ChatGPT 來生成語法，例如以下這段語法就是 ChatGPT 寫出來不翻譯雙括弧 `{{ ... }}` 內字串的語法：

```
=ARRAYFORMULA(
  IFERROR(
    REGEXREPLACE(
      GOOGLETRANSLATE(REGEXREPLACE(A1, "\{\{.*?\}\}", "PLACEHOLDER"), "en", "zh-CN"),
      "PLACEHOLDER",
      REGEXEXTRACT(A1, "\{\{.*?\}\}")
    ),
    A1
  )
)
```

或是撰寫 Google Apps Script 來處理更複雜的邏輯操作。

---
# 結語
i18n 的設定並不複雜，但有許多其他層面的問題需要溝通克服，例如：

- key 名稱衝突
- 相同的 value 被重複定義
- 冗餘的 Key Name
- 中文與英文間相似詞模稜兩可的翻譯（Sure, OK, Submit, Confirm...）

沒有規範的狀況下通常是不管，無限擴充、能動就好，我也遇過跳脫常人思維的奇人，依據畫面區塊來定義 key，導致用了很多 key 來定義相同的 value，為了明確標示區塊，這位奇人還疊加一堆前綴，導致每個 key 都比 value 還要長。

在公司有能力的前提下，可以訂定規範與有效的審查機制來維護，避免字典檔過度膨脹。