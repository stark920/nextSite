'use client'

import React, { useEffect } from 'react'

const PostContent = ({ content }: { content: string }) => {
  useEffect(() => {
    const codeBlocks = document.querySelectorAll('pre code')

    codeBlocks.forEach(block => {
      const parentPre = block.parentElement // Get the parent <pre> element
      if (!parentPre) return

      // Check if a copy button already exists
      if (parentPre.querySelector('.copy-btn')) return

      // Create the copy button
      const copyButton = document.createElement('button')
      copyButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm2 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h10v14z" />
        </svg>
      `
      copyButton.className = 'copy-btn'

      // Add click event to copy the content
      copyButton.onclick = () => {
        navigator.clipboard.writeText(block.textContent || '').then(() => {
          copyButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z" />
            </svg>
          `
          copyButton.classList.toggle('copy-btn-copied')
          setTimeout(() => {
            copyButton.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm2 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h10v14z" />
              </svg>
            `
            copyButton.classList.toggle('copy-btn-copied')
          }, 2000)
        })
      }

      // Add a relative position to the <pre> for absolute positioning of the button
      parentPre.style.position = 'relative'
      parentPre.appendChild(copyButton)
    })
  }, [content])

  return <article dangerouslySetInnerHTML={{ __html: content }} />
}

export default PostContent
