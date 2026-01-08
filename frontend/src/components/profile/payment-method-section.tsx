import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function PaymentMethodSection() {
    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-semibold">我的支付方式</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        安全保存您的支付卡信息，实现无忧支付。
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-500"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    添加支付方式
                </Button>
            </div>

            <div className="text-sm text-muted-foreground text-center py-8">
                暂无保存的支付方式
            </div>
        </Card>
    );
} 