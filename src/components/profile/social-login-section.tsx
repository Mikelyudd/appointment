import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SocialLoginSection() {
    return (
        <Card className="p-6">
            <div className="mb-6">
                <h2 className="text-lg font-semibold">社交账号关联</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    关联社交账号，实现快捷登录。
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-4">
                        <img 
                            src="/google.svg" 
                            alt="Google" 
                            className="w-6 h-6"
                        />
                        <div>
                            <div className="font-medium">Google</div>
                            <div className="text-sm text-muted-foreground">
                                未关联
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-500"
                    >
                        关联账号
                    </Button>
                </div>
            </div>
        </Card>
    );
} 