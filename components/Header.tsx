// components/Header.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandHeader } from '@/lib/BrandHeader';

const CTA_TEAL = '#18a7a7';
const BG_CREAM = '#f8f5f0';
const BORDER = 'rgba(0,0,0,0.06)';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#4B5563';

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System",
}) as string;

const TRACKS = [
  { emoji: '📊', label: 'Product Management', sub: 'Product sense, execution, strategy', path: '/interviews/product-management' },
  { emoji: '📈', label: 'Data Analytics',      sub: 'SQL, case studies, BI',              path: '/interviews/data-analytics' },
  { emoji: '🤖', label: 'Data Science',        sub: 'ML, stats, Python, system design',   path: '/interviews/data-science' },
  { emoji: '👥', label: 'HR',                  sub: 'HRBP, TA, behavioral',               path: '/interviews/hr' },
];

interface HeaderProps {
  showGetStarted?: boolean;
}

export const Header = ({ showGetStarted = false }: HeaderProps) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tracksOpen, setTracksOpen] = useState(false);

  const navigate = (path: string) => {
    setDrawerOpen(false);
    setTracksOpen(false);
    router.push(path as any);
  };

  return (
    <View style={styles.wrapper} accessibilityRole="banner">

      <View style={styles.header}>
        {/*
          headerInner is position:relative on web so the absolutely-
          positioned nav is scoped to it. Logo sits left in normal flow.
          Buttons use marginLeft:'auto' to push right. Nav floats in the
          exact centre via left:50% + translateX(-50%).
        */}
        <View style={[styles.headerInner, !isDesktop && styles.headerInnerMobile]}>

          {/* Logo — left, normal flow */}
          <TouchableOpacity onPress={() => navigate('/')} activeOpacity={0.8}>
            <BrandHeader small={!isDesktop} style={styles.brandOverride} />
          </TouchableOpacity>

          {/* Nav — absolutely centred on web, so it sits exactly halfway
              between the left edge and right edge of headerInner regardless
              of logo width or button group width. zIndex 50 keeps it
              clickable above the normal-flow siblings. */}
          {isDesktop && (
            <View style={styles.desktopNav}>

              <View style={styles.dropdownAnchor}>
                <TouchableOpacity
                  style={styles.navBtn}
                  onPress={() => setTracksOpen(!tracksOpen)}
                  activeOpacity={0.7}
                  accessibilityLabel="Interview tracks menu"
                >
                  <Text style={styles.navBtnText}>Interview tracks</Text>
                  <Text style={[styles.chevron, tracksOpen && styles.chevronOpen]}>›</Text>
                </TouchableOpacity>

                {tracksOpen && (
                  <View style={styles.dropdown}>
                    {TRACKS.map((t) => (
                      <TouchableOpacity
                        key={t.path}
                        style={styles.dropdownItem}
                        onPress={() => navigate(t.path)}
                        activeOpacity={0.75}
                      >
                        <Text style={styles.dropdownEmoji}>{t.emoji}</Text>
                        <View>
                          <Text style={styles.dropdownLabel}>{t.label}</Text>
                          <Text style={styles.dropdownSub}>{t.sub}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <TouchableOpacity style={styles.navBtn} onPress={() => navigate('/blog')} activeOpacity={0.7}>
                <Text style={styles.navBtnText}>Blog</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navBtn} onPress={() => navigate('/faq')} activeOpacity={0.7}>
                <Text style={styles.navBtnText}>FAQ</Text>
              </TouchableOpacity>

            </View>
          )}

          {/* Buttons — marginLeft auto pushes them to the far right */}
          <View style={[styles.navRight, !isDesktop && styles.navRightMobile]}>

            {isDesktop && (
              <>
                <TouchableOpacity
                  style={styles.loginTextBtn}
                  onPress={() => navigate('/auth/sign-in')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.loginTextLabel}>Log in</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, styles.btnSecondary]}
                  onPress={() => navigate('/auth/sign-up')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.btnText, styles.btnSecondaryText]}>Sign up</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary, !isDesktop && styles.btnMobile]}
              onPress={() => navigate('/mentors')}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnText, styles.btnPrimaryText, !isDesktop && styles.btnTextMobile]}>
                Browse mentors
              </Text>
            </TouchableOpacity>

            {!isDesktop && (
              <TouchableOpacity
                style={styles.hamburger}
                onPress={() => setDrawerOpen(!drawerOpen)}
                activeOpacity={0.7}
                accessibilityLabel={drawerOpen ? 'Close menu' : 'Open menu'}
              >
                {drawerOpen ? (
                  <Text style={styles.hamburgerClose}>✕</Text>
                ) : (
                  <View style={styles.hamburgerLines}>
                    <View style={styles.hamLine} />
                    <View style={styles.hamLine} />
                    <View style={styles.hamLine} />
                  </View>
                )}
              </TouchableOpacity>
            )}

          </View>
        </View>
      </View>

      {/* Mobile drawer — absolute on web so it floats above page content */}
      {!isDesktop && drawerOpen && (
        <View style={styles.drawer}>

          <TouchableOpacity
            style={styles.drawerLoginBtn}
            onPress={() => navigate('/auth/sign-in')}
            activeOpacity={0.7}
          >
            <Text style={styles.drawerLoginBtnText}>Log in</Text>
          </TouchableOpacity>

          <View style={styles.drawerDivider} />

          <Text style={styles.drawerSectionLabel}>Interview tracks</Text>
          {TRACKS.map((t) => (
            <TouchableOpacity
              key={t.path}
              style={styles.drawerItem}
              onPress={() => navigate(t.path)}
              activeOpacity={0.7}
            >
              <View style={styles.drawerItemLeft}>
                <Text style={styles.drawerEmoji}>{t.emoji}</Text>
                <Text style={styles.drawerLabel}>{t.label}</Text>
              </View>
              <Text style={styles.drawerArrow}>›</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.drawerDivider} />

          <TouchableOpacity style={styles.drawerItem} onPress={() => navigate('/blog')} activeOpacity={0.7}>
            <View style={styles.drawerItemLeft}>
              <Text style={styles.drawerEmoji}>📝</Text>
              <Text style={styles.drawerLabel}>Blog</Text>
            </View>
            <Text style={styles.drawerArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItem} onPress={() => navigate('/faq')} activeOpacity={0.7}>
            <View style={styles.drawerItemLeft}>
              <Text style={styles.drawerEmoji}>💬</Text>
              <Text style={styles.drawerLabel}>FAQ</Text>
            </View>
            <Text style={styles.drawerArrow}>›</Text>
          </TouchableOpacity>

        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({

  wrapper: {
    backgroundColor: BG_CREAM,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    zIndex: 100,
    ...Platform.select({
      web: { position: 'relative', overflow: 'visible', zIndex: 100 } as any,
    }),
  },

  header: {
    paddingTop: 20,
    paddingBottom: 16,
    ...Platform.select({ web: { overflow: 'visible' } as any }),
  },

  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 32,
    // position:relative on web so the absolutely-centred nav is scoped here
    ...Platform.select({ web: { position: 'relative', overflow: 'visible' } as any }),
  },
  headerInnerMobile: {
    paddingHorizontal: 16,
  },
  brandOverride: {
    marginBottom: 0,
  },

  // Nav: absolute centre on web via left:50% + translateX(-50%).
  // This guarantees the group sits exactly halfway across the header
  // regardless of logo or button widths. zIndex:50 keeps it tappable
  // above the normal-flow logo and button Views.
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    ...Platform.select({
      web: {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        overflow: 'visible',
      } as any,
    }),
  },

  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  navBtnText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  chevron: {
    fontFamily: SYSTEM_FONT,
    fontSize: 16,
    color: TEXT_MUTED,
    transform: [{ rotate: '90deg' }],
    lineHeight: 18,
  },
  chevronOpen: {
    transform: [{ rotate: '270deg' }],
  },

  // Dropdown
  dropdownAnchor: {
    position: 'relative',
    zIndex: 101,
    ...Platform.select({ web: { overflow: 'visible' } as any }),
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: BG_CREAM,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 6,
    minWidth: 260,
    zIndex: 101,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'visible',
      } as any,
    }),
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  dropdownEmoji: {
    fontSize: 16,
    width: 22,
    textAlign: 'center',
  },
  dropdownLabel: {
    fontFamily: SYSTEM_FONT,
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  dropdownSub: {
    fontFamily: SYSTEM_FONT,
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 1,
  },

  // Buttons — marginLeft auto pushes the group to the right edge
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Platform.select({ web: { marginLeft: 'auto' } as any }),
  },
  navRightMobile: {
    gap: 10,
  },

  loginTextBtn: {
    paddingHorizontal: 8,
    paddingVertical: 9,
  },
  loginTextLabel: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_MUTED,
  },

  btn: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 100,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: CTA_TEAL,
    borderColor: CTA_TEAL,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(0,0,0,0.2)',
  },
  btnMobile: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  btnText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  btnPrimaryText: {
    color: '#fff',
  },
  btnSecondaryText: {
    color: TEXT_DARK,
  },
  btnTextMobile: {
    fontSize: 13,
  },

  // Hamburger
  hamburger: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  hamburgerLines: {
    gap: 4,
    alignItems: 'center',
  },
  hamLine: {
    width: 16,
    height: 1.5,
    backgroundColor: TEXT_DARK,
    borderRadius: 2,
  },
  hamburgerClose: {
    fontFamily: SYSTEM_FONT,
    fontSize: 16,
    color: TEXT_DARK,
    lineHeight: 18,
  },

  // Mobile drawer — absolute on web, floats above page content
  drawer: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: BG_CREAM,
    ...Platform.select({
      web: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 200,
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      } as any,
    }),
  },

  drawerLoginBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 100,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 4,
  },
  drawerLoginBtnText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_DARK,
  },

  drawerSectionLabel: {
    fontFamily: SYSTEM_FONT,
    fontSize: 11,
    fontWeight: '600',
    color: TEXT_MUTED,
    letterSpacing: 0.08,
    textTransform: 'uppercase',
    paddingHorizontal: 12,
    paddingBottom: 8,
    paddingTop: 4,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  drawerItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drawerEmoji: {
    fontSize: 16,
    width: 22,
    textAlign: 'center',
  },
  drawerLabel: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    color: TEXT_DARK,
    fontWeight: '500',
  },
  drawerArrow: {
    fontFamily: SYSTEM_FONT,
    fontSize: 18,
    color: TEXT_MUTED,
    lineHeight: 20,
  },
  drawerDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 8,
  },
});