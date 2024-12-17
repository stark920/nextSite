---
title: 'Vue Post'
date: '2020-01-01'
description: 'This is a vue post This is a vue post This is a vue po This is a vue po This is a vue po This is a vue po This is a vue po This is a vue po This is a vue po'
order: 99
tags: 'Vue3, ImageCropper, Image, Cropper'
---

Next.js has two forms of pre-rendering: **Static Generation** and **Server-side Rendering**. The difference is in **when** it generates the HTML for a page.

- **Static Generation** is the pre-rendering method that generates the HTML at **build time**. The pre-rendered HTML is then _reused_ on each request.
- **Server-side Rendering** is the pre-rendering method that generates the HTML on **each request**.

Importantly, Next.js lets you **choose** which pre-rendering form to use for each page. You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.

```js
  try {
    const fullDirectory = `${postsDirectory}/${category}`
    const fileNames = fs.readdirSync(fullDirectory)
    const allPostsData = fileNames.map(fileName => {
      const id = fileName.replace(/\.md$/, '')
      // file name rule: [order]-[filename]
      const order = Number(id.split('-')[0])
      const fullPath = path.join(fullDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        id,
        order,
        ...(data as PostHead),
      } satisfies Post
    })
    return allPostsData.sort((a, b) => a.order - b.order)
  } catch {
    return []
  }
  ```