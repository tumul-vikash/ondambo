import auth from '@react-native-firebase/auth';

export async function sendOtp(phone) {
  const confirmation = await auth().signInWithPhoneNumber(`+264${phone}`);
  return confirmation;
}

export async function verifyOtp(confirmation, otp) {
  try {
    const data = await confirmation.confirm(otp);
    return data;
  } catch (error) {
    console.error(error);
    return 'invalid';
  }
}
