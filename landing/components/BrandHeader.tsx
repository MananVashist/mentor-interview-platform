'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface BrandHeaderProps {
  showEyes?: boolean
  style?: React.CSSProperties
  small?: boolean
}

export const BrandHeader = ({ style, small, showEyes }: BrandHeaderProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [leftEye, setLeftEye] = useState({ x: 0, y: 0 })
  const [rightEye, setRightEye] = useState({ x: 0, y: 0 })
  
  // Auto-detect mobile
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const shouldBeSmall = small || isMobile
  const shouldShowEyes = showEyes !== undefined ? showEyes : !shouldBeSmall

  // Eye Animation
  useEffect(() => {
    if (!isMounted || !shouldShowEyes) return

    const randomRange = (min: number, max: number) => Math.random() * (max - min) + min
    const MIN_DISTANCE = 8
    const MAX_DISTANCE = 12

    const moveEye = (
      currentPos: { x: number; y: number },
      setPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
    ) => {
      const angle = Math.random() * Math.PI * 2
      const distance = randomRange(MIN_DISTANCE, MAX_DISTANCE)
      let targetX = currentPos.x + Math.cos(angle) * distance
      let targetY = currentPos.y + Math.sin(angle) * distance

      targetX = Math.max(-10, Math.min(10, targetX))
      targetY = Math.max(-10, Math.min(10, targetY))

      setPos({ x: targetX, y: targetY })

      const duration = Math.max(300, Math.sqrt((targetX - currentPos.x) ** 2 + (targetY - currentPos.y) ** 2) / 0.04)
      
      setTimeout(() => moveEye({ x: targetX, y: targetY }, setPos), duration)
    }

    const leftPos = { x: 0, y: 0 }
    const rightPos = { x: 0, y: 0 }
    moveEye(leftPos, setLeftEye)
    moveEye(rightPos, setRightEye)
  }, [isMounted, shouldShowEyes])

  return (
    <Link href="/" style={{ textDecoration: 'none', ...style }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginBottom: '15px',
        }}
      >
        {/* Eyes wrapper */}
        {shouldShowEyes && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '6px',
              marginRight: '12px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#fff',
                borderRadius: '16px',
                border: '2.5px solid #333',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#333',
                  borderRadius: '6px',
                  transform: `translate(${leftEye.x}px, ${leftEye.y}px)`,
                  transition: 'transform 300ms ease-in-out',
                }}
              />
            </div>
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#fff',
                borderRadius: '16px',
                border: '2.5px solid #333',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#333',
                  borderRadius: '6px',
                  transform: `translate(${rightEye.x}px, ${rightEye.y}px)`,
                  transition: 'transform 300ms ease-in-out',
                }}
              />
            </div>
          </div>
        )}

        {/* Text container */}
        <div>
          <div
            style={{
              fontFamily: 'sans-serif',
              fontSize: shouldBeSmall ? '26px' : '26px',
              fontWeight: '800',
              lineHeight: shouldBeSmall ? '24px' : '38px',
            }}
          >
            <span style={{ color: '#333' }}>Crack</span>
            <span style={{ color: '#18a7a7' }}>Jobs</span>
          </div>
          <div
            style={{
              fontFamily: 'sans-serif',
              fontSize: shouldBeSmall ? '12px' : '14px',
              fontWeight: '700',
              color: '#18a7a7',
              marginTop: 0,
              marginLeft: '2px',
            }}
          >
            Mad skills. Dream job!
          </div>
        </div>
      </div>
    </Link>
  )
}