import {
  Card,
  CardContent,
} from '@/components/ui/card';

export default function BackupRestorePage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Backup & Restore</h1>
        <p className="text-muted-foreground">
          Backup and restore your customer database.
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">
              Backup & restore UI coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
