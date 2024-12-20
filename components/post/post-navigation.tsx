'use client'

import React, { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { HeadingData } from 'marked-gfm-heading-id'

type Props = {
  headings: HeadingData[]
}

export default function PostNavigation({ headings }: Props) {
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
        return (
          <li key={heading.id} className='min-w-0'>
            <a
              href={`#${heading.id}`}
              className={cn('block truncate text-sm duration-300 hover:underline', {
                'text-muted-foreground hover:text-foreground': activeId !== heading.id,
                'text-cyan-600': activeId === heading.id,
              })}
              style={{
                paddingLeft: `${heading.level - 1}rem`,
              }}
            >
              {heading.text}
            </a>
          </li>
        )
      })}
    </>
  )
}
