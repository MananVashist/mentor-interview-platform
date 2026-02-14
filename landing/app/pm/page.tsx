'use client'

// app/pm/page.tsx
import Link from 'next/link'
import Head from 'next/head'
import { Header } from '../../components/Header'

// ===== EXACT SAME CONSTANTS =====
const BRAND_ORANGE = "#f58742";
const CTA_TEAL = "#18a7a7";
const BG_CREAM = "#f8f5f0";
const TEXT_DARK = "#222";
const TEXT_GRAY = "#555";
const BORDER_LIGHT = "rgba(0,0,0,0.05)";

const COLOR_BRONZE = "#A67C52";
const BG_BRONZE = "#FCF8F5";
const COLOR_SILVER = "#71797E";
const BG_SILVER = "#F4F6F8";
const COLOR_GOLD = "#D4AF37";
const BG_GOLD = "#FFFEF5";

// EXACT SAME DATA
const TESTIMONIALS = [
  {
    name: "Priya S.",
    role: "Product Manager",
    company: "TATA",
    avatar: "👩‍💼",
    rating: 5,
    quote: "The mock interview was incredibly realistic. My mentor's feedback on my product sense helped me identify exact gaps.",
  },
  {
    name: "Rahul V.",
    role: "Data Analyst",
    company: "Bigbasket",
    avatar: "👨‍💻",
    rating: 5,
    quote: "I practiced SQL and case studies with a senior analyst. The detailed scorecard showed me exactly what to improve. Worth every rupee!",
  },
  {
    name: "Sneha P.",
    role: "Data Scientist",
    company: "Musigma",
    avatar: "👩‍🔬",
    rating: 5,
    quote: "Anonymous format removed all pressure. My mentor's ML system design feedback was gold. Recording helped me review and improve 2x faster.",
  },
  {
    name: "Amit K.",
    role: "HR Manager",
    company: "Flipkart",
    avatar: "👨‍💼",
    rating: 5,
    quote: "Practiced behavioral questions with an actual HRBP from ABFRL. The structured feedback on my STAR responses made all the difference in my interviews.",
  },
];

const GUARANTEES = [
  {
    icon: "💰",
    title: "100% Money-Back Guarantee",
    description: "If your mentor doesn't show up, you get a full refund. No questions asked.",
  },
  {
    icon: "🔄",
    title: "Free Rescheduling",
    description: "Life happens, we get it. Reschedule for free before your session. ",
  },
  {
    icon: "📹",
    title: "Recording Guaranteed",
    description: "Every session is recorded and shared within 24 hours. Review unlimited times.",
  },
  {
    icon: "📝",
    title: "Detailed Feedback Promise",
    description: "Structured scorecard with actionable tips delivered within 48 hours of your session.",
  },
];

const STEPS = [
  {
    emoji: "📝",
    title: "1. Browse mentors",
    desc: "Choose from a list of expert mentors in your domain and the topic you want to practice ",
  },
  {
    emoji: "🎥",
    title: "2. The Session",
    desc: "1:1 Video Call. Completely anonymous. Recording will be provided.",
  },
  {
    emoji: "📊",
    title: "3. The Feedback",
    desc: "Detailed written scorecard & actionable tips.",
  },
];

const FAQS = [
  {
    q: "How is the process anonymous?",
    a: "No personal details are revealed to any party. Only professional title you set during onboarding will be shown. During the meeting, the video can be kept off",
  },
  {
    q: "What will the detailed feedback be like?",
    a: "You don't just get a 'pass/fail'. You will get a feedback form with your strengths and areas of improvements highlighted by the interviewer",
  },
  {
    q: "What happens when the mentor does not show up for the session?",
    a: "You will be refunded the full amount. ",
  },
  {
    q: "What topic will the interview be on?",
    a: "You can choose the topic of your interview from a list of the commonly seen interview types in your domain",
  },
];

const PM_CONTENT = {
  title: "Product Management mock interviews",
  highlight: "with expert PMs",
  sub: "Test yourself on Product Strategy, Product Sense, Leadership, Execution or Technical PM skills against top hiring managers",
};

const TIERS = [
  {
    badge: "🥉",
    title: "Bronze Tier",
    sessions: "0-5 Sessions",
    price: "₹3,500 - ₹6,000",
    color: COLOR_BRONZE,
    bgColor: BG_BRONZE,
    borderColor: COLOR_BRONZE,
    benefits: [
      "Top performing mid-Level Managers",
      "5 - 10 yrs experienced",
      "Best for: Strengthening basics",
    ],
  },
  {
    badge: "🥈",
    title: "Silver Tier",
    sessions: "5-15 Sessions",
    price: "₹6,000 - ₹10,000",
    color: COLOR_SILVER,
    bgColor: BG_SILVER,
    borderColor: "#c0c0c0",
    benefits: [
      "Senior Management from top companies",
      "10-15 yrs experienced",
      "Best for: Senior level interviews",
    ],
  },
  {
    badge: "🥇",
    title: "Gold Tier",
    sessions: "15+ Sessions",
    price: "₹10,000 - ₹15,000",
    color: COLOR_GOLD,
    bgColor: BG_GOLD,
    borderColor: "#fbbf24",
    benefits: [
      "Leadership / Directors",
      "15-20 yrs experienced",
      "Best for: Hiring manager or CXO rounds",
    ],
  },
];

export default function PMPage() {
  return (
    <>
      <Head>
        <title>CrackJobs | Product Management mock interviews</title>
        <meta name="description" content="Practice Product Management mock interviews interviews with real experts. Test yourself on Product Strategy, Product Sense, Leadership, Execution or Technical PM skills against top hiring managers" />
      </Head>
      
      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section style={{
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        padding: '20px 24px 30px',
      }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '24px',
          padding: '40px',
          paddingBottom: '48px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
          border: `1px solid ${BORDER_LIGHT}`,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <h1 style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '800',
            fontSize: '42px',
            color: BRAND_ORANGE,
            lineHeight: '48px',
            marginBottom: '12px',
            margin: '0 0 12px 0',
          }}>
            {PM_CONTENT.title} 
          
            <span style={{ color: CTA_TEAL }}> {PM_CONTENT.highlight}</span>
          </h1>

          <p style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '17px',
            color: TEXT_GRAY,
            lineHeight: '26px',
            maxWidth: '600px',
            margin: '0 auto 30px',
          }}>
            {PM_CONTENT.sub}
          </p>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '24px',
            marginTop: '12px',
            flexWrap: 'wrap',
          }}>
            <Link href="/auth/sign-up" style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '15px',
              fontWeight: '700',
              color: '#fff',
              backgroundColor: CTA_TEAL,
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-block',
              minWidth: '160px',
              textAlign: 'center',
              boxShadow: `0 4px 8px ${CTA_TEAL}33`,
            }}>
              Book a PM Mock Interview
            </Link>
            <a href="#pricing" style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '15px',
              fontWeight: '700',
              color: TEXT_DARK,
              backgroundColor: 'transparent',
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-block',
              minWidth: '160px',
              textAlign: 'center',
              border: `2px solid ${CTA_TEAL}`,
            }}>
              View pricing
            </a>
          </div>

          <div style={{
            display: 'flex',
            gap: '24px',
            opacity: 0.8,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <span style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '13px',
              fontWeight: '500',
              color: TEXT_GRAY,
            }}>✓ Starts at ₹3,500</span>
            <span style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '13px',
              fontWeight: '500',
              color: TEXT_GRAY,
            }}>✓ 1:1 call</span>
            <span style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '13px',
              fontWeight: '500',
              color: TEXT_GRAY,
            }}>✓ Recording + scorecard</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        padding: '40px 24px',
      }}>
        <p style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: '800',
          fontSize: '12px',
          color: CTA_TEAL,
          marginBottom: '10px',
          textAlign: 'center',
          letterSpacing: '1px',
          margin: '0 0 10px 0',
        }}>THE PROCESS</p>
        
        <h2 style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: '800',
          fontSize: '28px',
          color: TEXT_DARK,
          marginBottom: '20px',
          textAlign: 'center',
          margin: '0 0 20px 0',
        }}>Simple.</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              backgroundColor: '#fff',
              padding: '24px',
              borderRadius: '16px',
              border: `1px solid ${BORDER_LIGHT}`,
              gap: '20px',
            }}>
              <div style={{ fontSize: '28px', lineHeight: 1 }}>{step.emoji}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: '700',
                  fontSize: '16px',
                  color: TEXT_DARK,
                  marginBottom: '4px',
                  marginTop: '4px',
                  lineHeight: 1.2,
                }}>{step.title}</h3>
                <p style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: '500',
                  fontSize: '14px',
                  color: TEXT_GRAY,
                  margin: 0,
                  lineHeight: '22px',
                }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{
        padding: '60px 24px 80px',
        backgroundColor: BG_CREAM,
      }}>
        <p style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: '800',
          fontSize: '12px',
          color: CTA_TEAL,
          marginBottom: '10px',
          textAlign: 'center',
          letterSpacing: '1px',
          margin: '0 0 10px 0',
        }}>SUCCESS STORIES</p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto',
          justifyContent: 'center',
          alignItems: 'stretch',
        }}>
          {TESTIMONIALS.map((testimonial, i) => (
            <div key={i} style={{
              backgroundColor: '#ffffff',
              padding: '32px',
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.08)',
              // 2x2 GRID LOGIC:
              width: 'calc(50% - 12px)',
              minWidth: '280px', 
              boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '18px',
                gap: '14px',
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '26px',
                  backgroundColor: BG_CREAM,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(0,0,0,0.05)',
                  fontSize: '26px',
                  flexShrink: 0,
                }}>
                  {testimonial.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: '17px',
                    fontWeight: '700',
                    color: TEXT_DARK,
                    marginBottom: '3px',
                  }}>{testimonial.name}</div>
                  <div style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: TEXT_GRAY,
                  }}>{testimonial.role} at {testimonial.company}</div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '3px',
                marginBottom: '18px',
              }}>
                {[...Array(testimonial.rating)].map((_, idx) => (
                  <span key={idx} style={{ fontSize: '15px' }}>⭐</span>
                ))}
              </div>

              <p style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '15px',
                lineHeight: '25px',
                color: TEXT_DARK,
                margin: '0 0 18px 0',
                flex: 1,
              }}>"{testimonial.quote}"</p>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          marginTop: '48px',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '13px',
              fontWeight: '600',
              color: TEXT_GRAY,
              opacity: 0.8,
            }}>✓ Verified testimonials</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '13px',
              fontWeight: '600',
              color: TEXT_GRAY,
              opacity: 0.8,
            }}>✓ Real candidate outcomes</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '13px',
              fontWeight: '600',
              color: TEXT_GRAY,
              opacity: 0.8,
            }}>✓ Proven results</span>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{
        maxWidth: '1100px', // Widened max-width slightly for the 3 columns
        width: '100%',
        margin: '0 auto',
        padding: '40px 24px',
      }}>
        <p style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: '800',
          fontSize: '12px',
          color: CTA_TEAL,
          marginBottom: '10px',
          textAlign: 'center',
          letterSpacing: '1px',
          margin: '0 0 10px 0',
        }}>PRICING</p>
        
        <h2 style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: '800',
          fontSize: '28px',
          color: TEXT_DARK,
          marginBottom: '32px',
          textAlign: 'center',
          margin: '0 0 32px 0',
        }}>Choose Your Mentor Tier</h2>

        <div style={{
          display: 'flex',
          gap: '24px',
          justifyContent: 'center',
          alignItems: 'stretch',
          width: '100%',
          flexWrap: 'wrap',
        }}>
          {TIERS.map((tier, i) => (
            <div key={i} style={{
              flex: 1,
              // Adjusted minWidth to ensure they stay on one line on laptops
              minWidth: '260px', 
              padding: '32px 28px',
              borderRadius: '16px',
              textAlign: 'center',
              borderWidth: '2px',
              borderStyle: 'solid',
              backgroundColor: tier.bgColor,
              borderColor: tier.borderColor,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{ marginBottom: '20px', fontSize: '56px', lineHeight: 1 }}>
                {tier.badge}
              </div>
              <div style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '700',
                fontSize: '20px',
                marginBottom: '8px',
                color: tier.color,
              }}>{tier.title}</div>
              <div style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '24px',
                marginBottom: '28px',
                fontWeight: '700',
                color: tier.color,
              }}>{tier.price}</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                {tier.benefits.map((benefit, j) => (
                  <div key={j} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    textAlign: 'left',
                  }}>
                    <span style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: '15px',
                      lineHeight: '24px',
                      fontWeight: '700',
                      color: tier.color,
                      minWidth: '15px',
                    }}>✓</span>
                    <span style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: '15px',
                      lineHeight: '24px',
                      flex: 1,
                      color: TEXT_DARK,
                    }}>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guarantee */}
      <section style={{
        padding: '60px 24px 80px',
        backgroundColor: BG_CREAM,
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          padding: '56px',
          borderRadius: '20px',
          maxWidth: '1100px',
          margin: '0 auto',
          width: '100%',
          border: '2px solid rgba(24, 167, 167, 0.3)',
          boxShadow: `0 4px 20px ${CTA_TEAL}1A`,
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#e8f9f9',
              padding: '11px 22px',
              borderRadius: '100px',
              gap: '10px',
              border: '1px solid rgba(24, 167, 167, 0.2)',
            }}>
              <span style={{ fontSize: '18px' }}>🛡️</span>
              <span style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '13px',
                fontWeight: '800',
                color: CTA_TEAL,
                letterSpacing: '1.2px',
              }}>RISK-FREE GUARANTEE</span>
            </div>
          </div>

          <h2 style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '38px',
            fontWeight: '800',
            color: TEXT_DARK,
            textAlign: 'center',
            lineHeight: '1.2',
            marginBottom: '18px',
            margin: '0 0 18px 0',
          }}>
            Practice with complete <span style={{ color: CTA_TEAL }}>confidence</span>
          </h2>

          <p style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '18px',
            fontWeight: '500',
            color: TEXT_GRAY,
            textAlign: 'center',
            lineHeight: '30px',
            marginBottom: '52px',
            maxWidth: '600px',
            margin: '0 auto 52px',
          }}>
            Your investment is protected. We've got your back every step of the way.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '44px',
            justifyContent: 'center',
            alignItems: 'stretch'
          }}>
            {GUARANTEES.map((guarantee, i) => (
              <div key={i} style={{
                backgroundColor: BG_CREAM,
                padding: '32px 28px',
                borderRadius: '16px',
                // 2x2 GRID LOGIC:
                width: 'calc(50% - 12px)',
                minWidth: '240px',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center', 
              }}>
                <div style={{ fontSize: '42px', marginBottom: '16px' }}>
                  {guarantee.icon}
                </div>
                <h3 style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: '17px',
                  fontWeight: '700',
                  color: TEXT_DARK,
                  marginBottom: '10px',
                  lineHeight: '24px',
                  margin: '0 0 10px 0',
                }}>{guarantee.title}</h3>
                <p style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: TEXT_GRAY,
                  lineHeight: '24px',
                  margin: 0,
                  maxWidth: '360px',
                }}>{guarantee.description}</p>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '18px',
            padding: '26px 0',
            borderTop: '1px solid rgba(0,0,0,0.08)',
            flexWrap: 'wrap',
          }}>
            {['SECURE PAYMENTS', 'VERIFIED MENTORS', 'INSTANT REFUNDS'].map((text, i) => (
               <div key={i} style={{
                backgroundColor: '#e8f9f9',
                padding: '9px 18px',
                borderRadius: '8px',
                border: '1px solid rgba(24, 167, 167, 0.15)',
              }}>
                <span style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: CTA_TEAL,
                  letterSpacing: '0.6px',
                }}>✓ {text}</span>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: '#fff9f5',
            padding: '22px',
            borderRadius: '12px',
            border: '1px solid rgba(245, 135, 66, 0.25)',
            marginTop: '28px',
          }}>
            <p style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '15px',
              fontWeight: '500',
              color: TEXT_GRAY,
              textAlign: 'center',
              lineHeight: '24px',
              margin: 0,
            }}>
              <span style={{ fontWeight: '800', color: TEXT_DARK }}>Still unsure?</span> Our support team is available 24/7 to answer any questions. Email us at crackjobshelpdesk@gmail.com
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        padding: '40px 24px',
      }}>
        <p style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: '800',
          fontSize: '12px',
          color: CTA_TEAL,
          marginBottom: '10px',
          textAlign: 'center',
          letterSpacing: '1px',
          margin: '0 0 10px 0',
        }}>FAQ</p>
        
        <h2 style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: '800',
          fontSize: '28px',
          color: TEXT_DARK,
          marginBottom: '32px',
          textAlign: 'center',
          margin: '0 0 32px 0',
        }}>Common Questions</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{
              backgroundColor: '#fff',
              padding: '24px',
              borderRadius: '12px',
              border: `1px solid ${BORDER_LIGHT}`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            }}>
              <h3 style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '700',
                fontSize: '16px',
                color: TEXT_DARK,
                marginBottom: '8px',
                margin: '0 0 8px 0',
              }}>{faq.q}</h3>
              <p style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '400',
                fontSize: '14px',
                color: TEXT_GRAY,
                lineHeight: '24px',
                margin: 0,
              }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <section style={{
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        padding: '40px 24px 60px',
      }}>
        <p style={{
          textAlign: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          color: '#999',
          fontSize: '13px',
          margin: 0,
        }}>
          © {new Date().getFullYear()} CrackJobs
        </p>
      </section>
    </>
  )
}