import {
  Card,
  CardContent,
} from '@/components/ui/card';

export default function DailySalesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Daily Sales</h1>
        <p className="text-muted-foreground">
          View your daily sales reports.
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">
              Daily sales report UI coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
