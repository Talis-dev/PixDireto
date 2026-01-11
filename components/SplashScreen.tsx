import React, { useEffect } from "react";
import { Image, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import packageJson from "../package.json";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <LinearGradient
      colors={["#06153e", "#0a1f5c", "#06153e"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Image
        source={require("../assets/icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.version}>v{packageJson.version}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
},
version: {
  color: "#ffffff",
  fontSize: 14,
  marginTop: 20,
  opacity: 0.7,
},
});
