import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Easing, Platform, Text, PanResponder, GestureResponderEvent, PanResponderGestureState, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { Plus, Dumbbell, Utensils, ScanLine, Activity, MessageCircle, Paperclip } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface ActionItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}

export const ShortcutButton: React.FC<{ testID?: string }> = ({ testID }) => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const rotate = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  const position = useRef({ x: 0, y: 0 }).current;
  const translate = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const toggle = useCallback(() => {
    const toValue = open ? 0 : 1;
    setOpen(!open);

    Animated.parallel([
      Animated.timing(rotate, { toValue, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(fade, { toValue, duration: 150, easing: Easing.out(Easing.quad), useNativeDriver: Platform.OS !== 'web' }),
      Animated.spring(scale, { toValue: open ? 0.95 : 1, useNativeDriver: Platform.OS !== 'web', friction: 6, tension: 70 }),
    ]).start();
  }, [open, rotate, fade, scale]);

  const handleBackdrop = useCallback(() => {
    if (open) toggle();
  }, [open, toggle]);

  const actions: ActionItem[] = useMemo(() => [
    {
      key: 'workout',
      label: 'Start workout',
      icon: <Dumbbell color={colors.text.primary} size={18} strokeWidth={2.5} />,
      onPress: () => {
        console.log('[Shortcut] Start workout');
        router.push('/workouts');
      },
    },
    {
      key: 'meal',
      label: 'Log meal',
      icon: <Utensils color={colors.text.primary} size={18} strokeWidth={2.5} />,
      onPress: () => {
        console.log('[Shortcut] Log meal');
        router.push('/meals/log');
      },
    },
    {
      key: 'scan',
      label: 'Scan item',
      icon: <ScanLine color={colors.text.primary} size={18} strokeWidth={2.5} />,
      onPress: () => {
        console.log('[Shortcut] Scan item');
        router.push('/meals/scan');
      },
    },
    {
      key: 'health',
      label: 'Health scan',
      icon: <Activity color={colors.text.primary} size={18} strokeWidth={2.5} />,
      onPress: () => {
        console.log('[Shortcut] Health scan');
        router.push('/medical/scan');
      },
    },
    {
      key: 'attachments',
      label: 'Attachments',
      icon: <Paperclip color={colors.text.primary} size={18} strokeWidth={2.5} />,
      onPress: () => {
        console.log('[Shortcut] Attachments');
        router.push('/profile/attachments');
      },
    },
    {
      key: 'coach',
      label: 'Message coach',
      icon: <MessageCircle color={colors.text.primary} size={18} strokeWidth={2.5} />,
      onPress: () => {
        console.log('[Shortcut] Message coach');
        router.push('/coaching');
      },
    },
  ], [router]);

  const rotation = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translate.setOffset({ x: position.x, y: position.y });
        translate.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: translate.x, dy: translate.y },
      ], { useNativeDriver: false }),
      onPanResponderRelease: (_: GestureResponderEvent, gesture: PanResponderGestureState) => {
        translate.flattenOffset();
        position.x += gesture.dx;
        position.y += gesture.dy;
      },
    })
  ).current;

  const onActionPress = useCallback((fn: () => void) => {
    try {
      fn();
    } catch (e) {
      console.error('[Shortcut] Action error', e);
    } finally {
      if (open) toggle();
    }
  }, [open, toggle]);

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Pressable
        onPress={handleBackdrop}
        style={[styles.backdrop, { opacity: open ? 1 : 0 }]}
        pointerEvents={open ? 'auto' : 'none'}
        testID="shortcut-backdrop"
        accessibilityRole="button"
        accessibilityLabel="Close shortcuts"
      />

      <Animated.View
        style={[
          styles.container,
          { transform: [...translate.getTranslateTransform()] },
        ]}
        {...panResponder.panHandlers}
      >
        {open && (
          <Animated.View style={[styles.menu, { opacity: fade, transform: [{ scale }] }]}> 
            {actions.map((a) => (
              <TouchableOpacity
                key={a.key}
                style={styles.action}
                onPress={() => onActionPress(a.onPress)}
                activeOpacity={0.85}
                testID={`shortcut-action-${a.key}`}
                accessibilityRole="button"
                accessibilityLabel={a.label}
              >
                <View style={styles.iconWrap}>{a.icon}</View>
                <Text style={styles.label}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        <TouchableOpacity
          style={styles.fabShadow}
          activeOpacity={0.9}
          onPress={toggle}
          testID={testID ?? 'shortcut-fab'}
          accessibilityRole="button"
          accessibilityLabel="Open shortcuts"
        >
          <Animated.View style={[styles.fab, { transform: [{ rotate: rotation }] }]}> 
            <Plus color={colors.text.primary} size={22} strokeWidth={3} />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  fabShadow: {
    borderRadius: 28,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.primary,
  },
  menu: {
    marginBottom: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.tertiary,
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '600' as const,
  },
});
