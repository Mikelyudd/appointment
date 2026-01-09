import { Alert, AlertDescription } from '@/components/ui/alert';

export function ErrorAlert({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
} 