import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor configuration for the Saarwood Teleprompter Android app.
 *
 * Build steps:
 *   1. npm run build  (in packages/frontend)
 *   2. npx cap sync android
 *   3. npx cap open android   (opens Android Studio)
 *   4. Build → Generate Signed Bundle/APK in Android Studio
 *
 * For CI/CD: use `./gradlew assembleRelease` inside android/
 */
const config: CapacitorConfig = {
  appId: 'com.saarwood.teleprompter',
  appName: 'Saarwood Teleprompter',
  webDir: 'dist',

  // When running with a live backend (LAN use), point to the backend host.
  // Leave commented out for fully offline / bundled mode.
  // server: {
  //   url: 'http://192.168.1.100:4000',
  //   cleartext: true,
  // },

  android: {
    // Allow mixed content (required when connecting to a local HTTP backend)
    allowMixedContent: true,
    // Hardware-accelerated rendering
    // captureInput: true,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#0a0a0a',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
  },
};

export default config;
