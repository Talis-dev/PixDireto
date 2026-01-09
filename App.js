import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "./global.css";

import HomeScreen from "./screens/HomeScreen";
import ConfigScreen from "./screens/ConfigScreen";
import QRCodeScreen from "./screens/QRCodeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState("Home");
  const [isReady, setIsReady] = useState(false);

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

  if (!isReady) {
    return null; // Ou um splash screen
  }

  return (
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
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="dark" />
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
