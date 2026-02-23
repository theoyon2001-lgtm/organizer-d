import { ArrowLeft, Armchair, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { upcomingEvents } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SeatLayoutEditorPage({
  params,
}: {
  params: { eventId: string };
}) {
  const event = upcomingEvents.find((e) => e.id === params.eventId);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/seats/layout-builder">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Seat Layout: {event.name}
          </h1>
          <p className="text-muted-foreground">
            Design and manage the seating arrangement for your event.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Layout Builder</CardTitle>
              <CardDescription>
                Click and drag to create sections. Select a section to edit its
                properties.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-[16/9] bg-muted/30 rounded-lg border-2 border-dashed flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Armchair className="mx-auto h-12 w-12" />
                  <p className="mt-2 font-semibold">
                    Interactive Layout Builder
                  </p>
                  <p className="text-sm">Coming Soon</p>
                </div>
                {/* Mock stage */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1/2 h-8 bg-muted rounded-md flex items-center justify-center">
                  <p className="font-bold text-muted-foreground">STAGE</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tools & Properties</CardTitle>
              <CardDescription>
                Manage sections and pricing tiers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Layout Name</Label>
                <Input defaultValue={`${event.name} Layout`} />
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Sections</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground p-4 bg-muted/30 rounded-md text-center">
                  No sections created yet.
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Pricing Tiers</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Tier
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">VIP</p>
                    <p className="text-sm text-muted-foreground">$150.00</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">General</p>
                    <p className="text-sm text-muted-foreground">$75.00</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button>Save Layout</Button>
        <Button variant="outline" type="button" asChild>
          <Link href="/seats/layout-builder">Cancel</Link>
        </Button>
      </div>
    </div>
  );
}
