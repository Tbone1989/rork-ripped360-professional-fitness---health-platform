import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

function DebugTest(): React.JSX.Element {
  console.log('[DebugTest] Mounted');

  return (
    <View style={styles.container} testID="debug-test-screen">
      <View style={styles.content} testID="debug-test-content">
        <Text style={styles.title}>DEBUG TEST SCREEN WORKING!</Text>
        <Text style={styles.subtitle}>Route: /debug-test</Text>
      </View>
    </View>
  );
}

export default memo(DebugTest);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  content: { width: '100%', maxWidth: 1180, paddingHorizontal: 24, paddingVertical: 16, alignItems: 'center' },
  title: { fontSize: 24, color: '#000', fontWeight: '700' as const, textAlign: 'center' },
  subtitle: { marginTop: 8, fontSize: 14, color: '#333', textAlign: 'center' },
});
