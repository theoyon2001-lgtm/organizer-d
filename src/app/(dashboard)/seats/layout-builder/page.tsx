import {
  Card,
  CardContent,
} from '@/components/ui/card';

export default function SeatLayoutBuilderPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Seat Layout Builder</h1>
        <p className="text-muted-foreground">
          Design your venue's seat layout.
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">
              Seat layout builder UI coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
