'use client'

import { Fragment, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { FaArrowUp } from 'react-icons/fa'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        setShow(true)
      } else {
        setShow(false)
      }
    })
  })

  const jumpToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Fragment>
      {show ? (
        <div className='fixed bottom-6 right-6 z-10'>
          <Button
            variant='secondary'
            onClick={jumpToTop}
            className='aspect-square p-0 opacity-50 transition-opacity duration-0 hover:opacity-100'
          >
            <FaArrowUp />
          </Button>
        </div>
      ) : (
        <Fragment />
      )}
    </Fragment>
  )
}
