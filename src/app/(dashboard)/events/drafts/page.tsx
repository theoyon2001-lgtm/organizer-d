import {
  Card,
  CardContent,
} from '@/components/ui/card';

export default function DraftEventsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Draft Events</h1>
        <p className="text-muted-foreground">
          Manage your draft events.
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">
              Your draft events will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
