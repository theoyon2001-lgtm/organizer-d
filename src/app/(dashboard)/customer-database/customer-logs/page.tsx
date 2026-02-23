import {
  Card,
  CardContent,
} from '@/components/ui/card';

export default function CustomerLogsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customer Logs</h1>
        <p className="text-muted-foreground">
          View logs of customer activities.
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">
              Customer logs will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
