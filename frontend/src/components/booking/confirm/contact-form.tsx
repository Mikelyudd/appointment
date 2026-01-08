// src/components/booking/confirm/contact-form.tsx
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface ContactFormProps {
    onSubmit: (data: { phone: string; code: string }) => Promise<void>;
    isSubmitting?: boolean;
    error?: string | null;
    defaultPhone?: string;
}

export function ContactForm({ onSubmit, isSubmitting, error, defaultPhone }: ContactFormProps) {
    const [phone, setPhone] = useState(() => {
        try {
            return defaultPhone || localStorage.getItem('recentPhone') || '';
        } catch (e) {
            return defaultPhone || '';
        }
    });

    const [code, setCode] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
    const isInitialMount = useRef(true);

    // 保存最近使用的手机号
    useEffect(() => {
        if (phone) {
            try {
                localStorage.setItem('recentPhone', phone);
            } catch (e) {
                // 忽略隐私模式下的错误
            }
        }
    }, [phone]);

    // 倒计时效果
    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown(c => c - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [countdown]);

    // 自动填充验证码到输入框
    const fillVerificationCode = useCallback((verificationCode: string) => {
        if (!verificationCode || verificationCode.length !== 6) return;
        
        console.log('自动填充验证码:', verificationCode);
        setCode(verificationCode);
        verificationCode.split('').forEach((digit: string, index: number) => {
            const input = inputRefs.current[index];
            if (input) {
                input.value = digit;
            }
        });
    }, []);

    const sendVerificationCode = useCallback(async () => {
        if (isSendingCode || countdown > 0) return;
        if (!phone) {
            toast({
                title: "错误",
                description: "请输入手机号码",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsSendingCode(true);
            const response = await api.sendVerificationCode(phone);
            console.log('验证码响应:', response);
            
            // 如果收到验证码（开发环境），则自动填充
            if (response.code) {
                console.log('收到验证码:', response.code);
                fillVerificationCode(response.code);
                toast({
                    title: "开发模式",
                    description: `验证码：${response.code}`,
                });
            } else {
                toast({
                    title: "成功",
                    description: response.message || "验证码已发送",
                });
            }
            setCountdown(60);
        } catch (error: any) {
            console.error('发送验证码失败:', error);
            toast({
                title: "错误",
                description: error.message || "发送验证码失败，请稍后重试",
                variant: "destructive",
            });
        } finally {
            setIsSendingCode(false);
        }
    }, [phone, isSendingCode, countdown, fillVerificationCode]);

    const handleDigitChange = useCallback((index: number, value: string) => {
        const digit = value.replace(/[^0-9]/g, '');
        
        if (digit && inputRefs.current[index]) {
            inputRefs.current[index]!.value = digit;
            if (index < 5 && inputRefs.current[index + 1]) {
                inputRefs.current[index + 1]!.focus();
            }
        }

        const newCode = inputRefs.current.map(input => input?.value || '').join('');
        setCode(newCode);
    }, []);

    const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !inputRefs.current[index]?.value) {
            if (index > 0 && inputRefs.current[index - 1]) {
                inputRefs.current[index - 1]!.focus();
            }
        }
    }, []);

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
        fillVerificationCode(pastedData);
    }, [fillVerificationCode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log('Form submission - Values:', {
            phone,
            code,
            codeLength: code.length,
            time: new Date().toISOString()
        });

        if (!phone || !code || code.length !== 6) {
            const missingFields = [];
            if (!phone) missingFields.push('手机号码');
            if (!code) missingFields.push('验证码');
            if (code && code.length !== 6) missingFields.push('完整的6位验证码');

            console.error('Form validation failed:', {
                phone: !phone ? 'missing' : 'present',
                code: !code ? 'missing' : code.length !== 6 ? 'invalid length' : 'valid',
                time: new Date().toISOString()
            });

            toast({
                title: "验证失败",
                description: `请填写${missingFields.join('、')}`,
                variant: "destructive",
            });
            return;
        }

        try {
            await onSubmit({ 
                phone: phone.trim(), 
                code: code.trim() 
            });
        } catch (error: any) {
            console.error('Form submission error:', {
                error: error.message,
                time: new Date().toISOString()
            });
            toast({
                title: "提交失败",
                description: error.message || "验证失败，请重试",
                variant: "destructive",
            });
        }
    };

    const setInputRef = useCallback((index: number) => (el: HTMLInputElement | null) => {
        inputRefs.current[index] = el;
    }, []);

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">手机号码</label>
                    <div className="flex gap-2">
                        <Input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="请输入手机号码"
                            required
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={sendVerificationCode}
                            disabled={isSendingCode || countdown > 0}
                        >
                            {isSendingCode ? '发送中...' : countdown > 0 ? `${countdown}秒` : '获取验证码'}
                        </Button>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">验证码</label>
                    <div className="flex gap-2 justify-between">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <input
                                key={i}
                                ref={setInputRef(i)}
                                type="text"
                                maxLength={1}
                                className="w-12 h-12 text-center text-lg border rounded-md"
                                onChange={(e) => handleDigitChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                onPaste={handlePaste}
                            />
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || code.length !== 6}
                >
                    {isSubmitting ? '提交中...' : '提交'}
                </Button>
            </form>
        </div>
    );
}
