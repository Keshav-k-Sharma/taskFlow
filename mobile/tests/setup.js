jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));
jest.mock("@react-native-community/netinfo", () => ({
  __esModule: true,
  default: { refresh: jest.fn() },
  useNetInfo: jest.fn(() => ({ isConnected: true, isInternetReachable: true })),
}));
jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return { SafeAreaView: View, SafeAreaProvider: View };
});
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  },
  useFocusEffect: (callback) => {
    const React = require("react");
    React.useEffect(callback, [callback]);
  },
}));
jest.mock("@react-native-community/datetimepicker", () => "DateTimePicker");
jest
  .spyOn(require("react-native").AccessibilityInfo, "isReduceMotionEnabled")
  .mockResolvedValue(true);
