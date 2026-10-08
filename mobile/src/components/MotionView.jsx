import { useEffect, useState } from "react";
import { AccessibilityInfo, Animated } from "react-native";

/** Fades screens into place with native animation, honoring live motion preferences. */
export default function MotionView({ children, style }) {
  const [progress] = useState(() => new Animated.Value(1));
  useEffect(() => {
    let active = true;
    let animation;
    /** Applies the current accessibility preference without hiding screen content. */
    function configure(reduceMotion) {
      if (!active) return;
      animation?.stop();
      if (reduceMotion) progress.setValue(1);
      else {
        progress.setValue(0);
        animation = Animated.timing(progress, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
          isInteraction: false,
        });
        animation.start();
      }
    }
    AccessibilityInfo.isReduceMotionEnabled()
      .then(configure)
      .catch(() => configure(true));
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      configure,
    );
    return () => {
      active = false;
      animation?.stop();
      subscription.remove();
    };
  }, [progress]);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
