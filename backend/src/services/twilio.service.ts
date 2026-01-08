import twilio from 'twilio';

export class TwilioService {
    private static client: twilio.Twilio;

    static initialize() {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        
        if (!accountSid || !authToken) {
            throw new Error('Twilio credentials are not configured');
        }

        this.client = twilio(accountSid, authToken);
    }

    static async sendSMS(to: string, body: string) {
        try {
            if (!this.client) {
                this.initialize();
            }

            const fromNumber = process.env.TWILIO_PHONE_NUMBER;
            if (!fromNumber) {
                throw new Error('Twilio phone number is not configured');
            }

            // 格式化电话号码
            let formattedNumber = to;
            // 移除所有非数字字符
            const digits = to.replace(/\D/g, '');
            
            // 如果是美国号码（10位数字）
            if (digits.length === 10) {
                formattedNumber = `+1${digits}`;
            }
            // 如果已经包含国际区号（11位或更多）
            else if (digits.length >= 11) {
                formattedNumber = `+${digits}`;
            }

            console.log('Attempting to send SMS with:', {
                from: fromNumber,
                to: formattedNumber,
                body: body,
                accountSid: process.env.TWILIO_ACCOUNT_SID?.slice(-4) // 只显示最后4位
            });

            // 先检查账号状态
            const account = await this.client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
            console.log('Account status:', {
                status: account.status,
                type: account.type
            });

            const message = await this.client.messages.create({
                body,
                from: fromNumber,
                to: formattedNumber
            });

            console.log('SMS sent successfully:', {
                sid: message.sid,
                status: message.status,
                direction: message.direction,
                from: message.from,
                to: message.to,
                errorCode: message.errorCode,
                errorMessage: message.errorMessage,
                dateCreated: message.dateCreated,
                dateUpdated: message.dateUpdated,
                numSegments: message.numSegments,
                numMedia: message.numMedia,
                price: message.price,
                priceUnit: message.priceUnit
            });
            
            // 如果消息创建成功但状态不是 'sent' 或 'delivered'
            if (message.status !== 'delivered' && message.status !== 'sent') {
                console.warn('Message created but status is:', message.status);
                if (message.errorCode) {
                    console.warn('Message error:', {
                        code: message.errorCode,
                        message: message.errorMessage
                    });
                }
            }

            return message;
        } catch (error: any) {
            console.error('Detailed Twilio error:', {
                code: error.code,
                message: error.message,
                moreInfo: error.moreInfo,
                status: error.status,
                details: error.details,
                raw: error
            });

            // 如果是试用账号的限制
            if (error.code === 20003) {
                console.error('This might be a trial account restriction. Please verify:');
                console.error('1. The phone number is verified in Twilio console');
                console.error('2. You have sufficient trial balance');
                console.error('3. You are within the trial account limits');
            }

            throw error;
        }
    }
} 