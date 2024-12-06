'use client'

import { Tokens } from 'marked'
import React, { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

export default function PostNavigation({ headings }: { headings: Tokens.Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id) // Update the active heading based on visibility
        }
      })
    }

    observer.current = new IntersectionObserver(handleIntersection, {
      root: null, // Use the viewport as the root
      rootMargin: '0px 0px -70% 0px', // Trigger when the heading is in the top 30% of the viewport
      threshold: 0.1, // Trigger when at least 10% of the heading is visible
    })

    const headingElements = document.querySelectorAll('h1, h2, h3')
    headingElements.forEach(el => observer.current?.observe(el))

    return () => {
      // Cleanup the observer
      observer.current?.disconnect()
    }
  }, [])

  return (
    <>
      {headings.map(heading => {
        const id = heading.text.toLowerCase().replace(/\s+/g, '-')
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              className={cn('text-sm hover:underline duration-300', {
                'text-muted-foreground hover:text-foreground': activeId !== id,
                'text-cyan-600': activeId === id,
              })}
              style={{
                paddingLeft: `${heading.depth - 1}rem`,
              }}
            >
              {id}
            </a>
          </li>
        )
      })}
    </>
  )
}
