import {
  Card,
  CardContent,
} from '@/components/ui/card';

export default function ExportCsvPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Export CSV</h1>
        <p className="text-muted-foreground">
          Export your order data to a CSV file.
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">
              CSV export options will be available here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
