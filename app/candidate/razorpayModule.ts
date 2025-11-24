// app/candidate/razorpayModule.ts
import { Platform } from 'react-native';

let RazorpayCheckout: any = null;

// Only try to load the native library if we are NOT on web
if (Platform.OS !== 'web') {
  try {
    // We use 'require' instead of 'import' so we can wrap it in a try/catch
    // This prevents the app from crashing if the library is missing
    RazorpayCheckout = require('react-native-razorpay').default;
  } catch (error) {
    console.warn("⚠️ Razorpay Native Module not found.", error);
  }
}

export default RazorpayCheckout;