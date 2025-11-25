import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Header } from './Header';
import { Footer } from './Footer';

type PageLayoutProps = {
  children: React.ReactNode;
};

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <View style={styles.mainContainer}>
      <Header />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentWrapper}>
          {children}
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f8f5f0' }, // Matches Header BG
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, flexDirection: 'column' },
  contentWrapper: { flex: 1, width: '100%' },
});