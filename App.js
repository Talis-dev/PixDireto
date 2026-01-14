import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

import HomeScreen from "./screens/HomeScreen";
import ConfigScreen from "./screens/ConfigScreen";
import QRCodeScreen from "./screens/QRCodeScreen";
import PixKeysScreen from "./screens/PixKeysScreen";
import ProductsScreen from "./screens/ProductsScreen";
import AboutScreen from "./screens/AboutScreen";
import HistoryScreen from "./screens/HistoryScreen";
import SplashScreen from "./components/SplashScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState("Home");
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    checkInitialRoute();
  }, []);

  const checkInitialRoute = async () => {
    try {
      const pixKey = await AsyncStorage.getItem("pixKey");
      const name = await AsyncStorage.getItem("merchantName");
      const city = await AsyncStorage.getItem("merchantCity");

      // Se não tiver configuração, vai direto para Config
      if (!pixKey || !name || !city) {
        setInitialRoute("Config");
      }
    } catch (error) {
      console.error("Erro ao verificar configuração inicial:", error);
    } finally {
      setIsReady(true);
    }
  };

  if (showSplash || !isReady) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GluestackUIProvider config={config}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={initialRoute}
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                contentStyle: { backgroundColor: "#F9FAFB" },
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Config" component={ConfigScreen} />
              <Stack.Screen name="QRCode" component={QRCodeScreen} />
              <Stack.Screen name="PixKeys" component={PixKeysScreen} />
              <Stack.Screen name="Products" component={ProductsScreen} />
              <Stack.Screen name="About" component={AboutScreen} />
              <Stack.Screen name="History" component={HistoryScreen} />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="dark" />
        </GluestackUIProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
