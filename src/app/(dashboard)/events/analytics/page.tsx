import {
  Card,
  CardContent,
} from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View analytics for your events.
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">
              Analytics UI coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
