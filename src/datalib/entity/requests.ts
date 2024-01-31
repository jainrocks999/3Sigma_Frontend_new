export interface VerifyAuthRequest {
  loginType?: string;
  deviceToken?: string | null;
  phone?: string;
  otp?: string;
  googleId?: string;
  facebookId?: string;
  email?: string;
  loggedFrom?: string;
}
export interface SedOtpRequest {
  otpType: string;
  phone: string;
  countryCode: string;
  loggedFrom?: string;
}
