import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar as RNStatusBar,
  Dimensions,
  Alert,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  runOnJS
} from 'react-native-reanimated';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as LocalAuthentication from 'expo-local-authentication';

// Fix for "Cannot find name 'require'" error
declare var require: any;

// --- THEME CONSTANTS ---
const COLORS = {
  navy: {
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  emerald: {
    500: '#10b981',
    800: '#065f46',
    900: '#064e3b',
  },
  gold: {
    400: '#fbbf24',
    500: '#f59e0b',
  },
  slate: {
    200: '#e2e8f0',
    400: '#94a3b8',
    500: '#64748b',
  },
  white: '#ffffff',
};

// --- AUTH SCREEN (Biometrics) ---
const AuthScreen = ({ onAuthenticated }: { onAuthenticated: () => void }) => {
  const [status, setStatus] = useState('Scanning...');

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        // Fallback for devices without biometrics or simulator
        setStatus('Biometrics unavailable');
        // In prod, you might ask for pin. For demo, we auto-login after delay.
        setTimeout(onAuthenticated, 1000); 
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Shijra Legacy',
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
        cancelLabel: 'Cancel'
      });

      if (result.success) {
        setStatus('Authenticated');
        onAuthenticated();
      } else {
        setStatus('Authentication Failed');
        Alert.alert("Access Denied", "Please try again.", [
          { text: "Retry", onPress: checkBiometrics }
        ]);
      }
    } catch (e) {
      console.log(e);
      setStatus('Error');
      // Fallback for demo purposes
      onAuthenticated();
    }
  };

  return (
    <View style={styles.splashContainer}>
      <MaterialCommunityIcons name="face-recognition" size={64} color={COLORS.gold[400]} />
      <Text style={[styles.splashSubtitle, { marginTop: 20 }]}>{status}</Text>
    </View>
  );
};

// --- SCREENS ---

// 1. Home Screen
const HomeScreen = () => {
  return (
    <LinearGradient
      colors={[COLORS.navy[950], COLORS.navy[900]]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>Ahmed Family</Text>
          </View>
          <View style={styles.avatarPlaceholder}>
             <Text style={styles.avatarText}>A</Text>
          </View>
        </View>

        <View style={styles.heroSection}>
          <LinearGradient
            colors={[COLORS.emerald[900], COLORS.navy[900]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.pillBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.pillText}>LEGACY ACTIVE</Text>
            </View>
            <Text style={styles.heroTitle}>Grow Your{"\n"}Family Tree</Text>
            <Text style={styles.heroSubtitle}>
              Add new members or record a voice memory today.
            </Text>
            
            <TouchableOpacity style={styles.buttonPrimary}>
              <Text style={styles.buttonText}>Add Member</Text>
              <Feather name="plus" size={18} color="white" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <Text style={styles.sectionTitle}>Recent Memories</Text>
        
        {/* Placeholder Items */}
        {[1, 2].map((item) => (
          <View key={item} style={styles.listItem}>
            <View style={styles.iconBox}>
              <Feather name="mic" size={20} color={COLORS.gold[400]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listTitle}>Grandfather's Village Story</Text>
              <Text style={styles.listSub}>Recorded 2 days ago</Text>
            </View>
            <TouchableOpacity>
              <Feather name="play-circle" size={24} color={COLORS.slate[400]} />
            </TouchableOpacity>
          </View>
        ))}

      </SafeAreaView>
    </LinearGradient>
  );
};

// 2. Tree Screen (Placeholder)
const TreeScreen = () => (
  <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.navy[950] }]}>
    <MaterialCommunityIcons name="family-tree" size={80} color={COLORS.emerald[500]} style={{ opacity: 0.5 }} />
    <Text style={[styles.heroTitle, { fontSize: 24, marginTop: 20 }]}>Interactive Tree</Text>
    <Text style={styles.heroSubtitle}>Radial visualization coming soon.</Text>
  </View>
);

// 3. Stories Screen (Placeholder)
const StoriesScreen = () => (
  <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.navy[950] }]}>
    <Feather name="book-open" size={80} color={COLORS.gold[400]} style={{ opacity: 0.5 }} />
    <Text style={[styles.heroTitle, { fontSize: 24, marginTop: 20 }]}>Oral Histories</Text>
    <Text style={styles.heroSubtitle}>Listen to your family legacy.</Text>
  </View>
);

// 4. Chat Screen (New)
const ChatScreen = () => (
  <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.navy[950] }]}>
    <Feather name="message-circle" size={80} color={COLORS.emerald[500]} style={{ opacity: 0.5 }} />
    <Text style={[styles.heroTitle, { fontSize: 24, marginTop: 20 }]}>Family Chat</Text>
    <Text style={styles.heroSubtitle}>Encrypted conversations.</Text>
  </View>
);

// 5. Profile Screen (Placeholder)
const ProfileScreen = () => (
  <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.navy[950] }]}>
    <Feather name="user" size={80} color={COLORS.slate[400]} style={{ opacity: 0.5 }} />
    <Text style={[styles.heroTitle, { fontSize: 24, marginTop: 20 }]}>Settings</Text>
  </View>
);

// --- NAVIGATION CONFIG ---

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      id="main-tabs"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.navy[900], // Fallback
          borderTopWidth: 0,
          elevation: 0,
          height: 65,
          paddingBottom: 10,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarBackground: () => (
           // Glassmorphism Effect for Tab Bar
          <BlurView tint="dark" intensity={50} style={StyleSheet.absoluteFill} />
        ),
        tabBarActiveTintColor: COLORS.gold[400],
        tabBarInactiveTintColor: COLORS.slate[500],
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 10, marginTop: -5, fontFamily: 'Inter-Regular' },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Tree" 
        component={TreeScreen} 
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="tree-outline" size={26} color={color} />
        }}
      />
       <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{
          tabBarIcon: ({ color }) => <Feather name="message-circle" size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Stories" 
        component={StoriesScreen} 
        options={{
          tabBarIcon: ({ color }) => <Feather name="mic" size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />
        }}
      />
    </Tab.Navigator>
  );
};

// --- SPLASH SCREEN COMPONENT ---

const CustomSplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Logo Animation: Scale up and fade in
    scale.value = withSpring(1, { damping: 10 });
    opacity.value = withTiming(1, { duration: 1000 });

    // Transition out after 2.5 seconds
    const timeout = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.splashContainer}>
      <StatusBar style="light" />
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <LinearGradient
          colors={[COLORS.emerald[500], COLORS.emerald[800]]}
          style={styles.logoBackground}
        >
          <Text style={styles.logoText}>S</Text>
        </LinearGradient>
        <Text style={styles.splashTitle}>Shijra</Text>
        <Text style={styles.splashSubtitle}>Legacy Preserved</Text>
      </Animated.View>
    </View>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load Fonts
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'), // Ensure you have these files
    'PlayfairDisplay-Regular': require('./assets/fonts/PlayfairDisplay-Regular.ttf'),
    'PlayfairDisplay-Bold': require('./assets/fonts/PlayfairDisplay-Bold.ttf'),
  });

  useEffect(() => {
    // In a real app, you'd check fontsLoaded here
    if (true) { 
      setAppIsReady(true);
    }
  }, [fontsLoaded]);

  if (!appIsReady) {
    return null;
  }

  // Render Flow: Splash -> Biometric Auth -> Main App
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor={COLORS.navy[950]} />
        
        {showSplash ? (
          <CustomSplashScreen onFinish={() => setShowSplash(false)} />
        ) : !isAuthenticated ? (
          <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />
        ) : (
          <Stack.Navigator 
            id="root-stack"
            screenOptions={{ headerShown: false, animation: 'fade' }}
          >
            <Stack.Screen name="Main" component={TabNavigator} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy[950],
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  greeting: {
    color: COLORS.slate[400],
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  userName: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.navy[800],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold[500],
  },
  avatarText: {
    color: COLORS.gold[400],
    fontWeight: 'bold',
  },
  // Hero
  heroSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  heroCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 78, 59, 0.5)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.emerald[800],
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.emerald[500],
    marginRight: 6,
  },
  pillText: {
    color: COLORS.emerald[500],
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 32,
    fontFamily: 'PlayfairDisplay-Bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: COLORS.slate[200],
    fontSize: 14,
    marginBottom: 20,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  buttonPrimary: {
    backgroundColor: COLORS.gold[400],
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    shadowColor: COLORS.gold[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.navy[950],
    fontWeight: 'bold',
    marginRight: 8,
  },
  // Lists
  sectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-Bold',
    marginLeft: 20,
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.5)', // Glassy feel
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  listTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  listSub: {
    color: COLORS.slate[500],
    fontSize: 12,
  },
  // Splash
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.navy[950],
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.emerald[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: 48,
    color: 'white',
    fontFamily: 'PlayfairDisplay-Bold',
  },
  splashTitle: {
    fontSize: 32,
    color: COLORS.white,
    fontFamily: 'PlayfairDisplay-Bold',
    letterSpacing: 1,
  },
  splashSubtitle: {
    fontSize: 14,
    color: COLORS.gold[400],
    letterSpacing: 2,
    marginTop: 8,
    fontFamily: 'Inter-Regular',
  },
});
