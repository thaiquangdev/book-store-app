import * as crypto from 'crypto';

/**
 * Hàm tạo OTP 6 chữ số và thời gian hết hạn
 * @param expiryMinutes - Thời gian hết hạn tính bằng phút (mặc định 5 phút)
 * @returns { otp: string, otpExpiry: Date }
 */

export function generateOtp(expiryMinutes = 5): {
  otp: string;
  otpExpiry: Date;
} {
  const otp = crypto.randomInt(100000, 999999).toString(); // tạo otp với 6 chữ số
  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + expiryMinutes); // hết hạn sau `expiryMinutes`
  return { otp, otpExpiry };
}
