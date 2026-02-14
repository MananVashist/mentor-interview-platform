'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { BrandHeader } from './BrandHeader'

const CTA_TEAL = '#18a7a7'
const BG_CREAM = '#f8f5f0'

interface HeaderProps {
  showGetStarted?: boolean
}

export const Header = ({ showGetStarted = false }: HeaderProps) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <header
      style={{
        backgroundColor: BG_CREAM,
        paddingTop: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          paddingLeft: isMobile ? '16px' : '32px',
          paddingRight: isMobile ? '16px' : '32px',
        }}
      >
        {/* Brand Section */}
        <BrandHeader small={isMobile} style={{ marginBottom: 0 }} />

        {/* Navigation Buttons */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: isMobile ? '16px' : '24px',
            alignItems: 'center',
          }}
        >
          {/* Log in - Text on mobile, Button on desktop */}
          {isMobile ? (
            <Link
              href="/auth/sign-in"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                textDecoration: 'none',
              }}
            >
              Log in
            </Link>
          ) : (
            <Link
              href="/auth/sign-in"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '15px',
                fontWeight: '700',
                letterSpacing: '1px',
                color: '#333',
                backgroundColor: 'transparent',
                border: '2px solid #333',
                paddingLeft: '28px',
                paddingRight: '28px',
                paddingTop: '10px',
                paddingBottom: '10px',
                borderRadius: '100px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              LOGIN
            </Link>
          )}

          {/* Get Started / Sign Up Button */}
          <Link
            href="/auth/sign-up"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: isMobile ? '12px' : '15px',
              fontWeight: '700',
              letterSpacing: isMobile ? '0' : '1px',
              color: '#fff',
              backgroundColor: CTA_TEAL,
              border: `2px solid ${CTA_TEAL}`,
              paddingLeft: isMobile ? '20px' : '28px',
              paddingRight: isMobile ? '20px' : '28px',
              paddingTop: '10px',
              paddingBottom: '10px',
              borderRadius: '100px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            {showGetStarted ? 'Get Started' : 'SIGN UP'}
          </Link>
        </nav>
      </div>
    </header>
  )
}