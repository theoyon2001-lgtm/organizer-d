import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function SeatsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Seat Management</h1>
        <p className="text-muted-foreground">
          Design layouts, create ticket categories, and set pricing.
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">
              Seat layout builder and management UI coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
