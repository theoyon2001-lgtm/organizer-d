import {
  Card,
  CardContent,
} from '@/components/ui/card';

export default function AttendeeListPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendee List</h1>
        <p className="text-muted-foreground">
          View and manage the attendee list for your events.
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">
              Your attendee list will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
