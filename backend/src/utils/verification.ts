/**
 * 生成指定长度的数字验证码
 * @param length 验证码长度，默认为6位
 * @returns 生成的验证码字符串
 */
export const generateVerificationCode = (length: number = 6): string => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

/**
 * 格式化手机号码
 * @param phone 手机号码
 * @returns 格式化后的手机号码
 */
export function formatPhoneNumber(phone: string): string {
    // 移除所有非数字字符
    const digits = phone.replace(/\D/g, '');
    
    // 如果已经包含国际区号（以+1开头）
    if (phone.startsWith('+1')) {
        return phone;
    }
    
    // 如果是10位美国号码
    if (digits.length === 10) {
        return `+1${digits}`;
    }
    
    // 如果是11位且以1开头的美国号码
    if (digits.length === 11 && digits.startsWith('1')) {
        return `+${digits}`;
    }
    
    // 如果是其他格式，保持原样
    return phone;
} 