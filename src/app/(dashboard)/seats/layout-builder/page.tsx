'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { upcomingEvents } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function SeatLayoutBuilderPage() {
  const { toast } = useToast();

  // For demonstration, we'll assume some events have layouts and some don't
  const eventsWithLayoutStatus = upcomingEvents.map((event, index) => ({
    ...event,
    hasLayout: index % 2 === 0, // Mock data: every other event has a layout
  }));

  const handleManageLayoutClick = (eventName: string) => {
    toast({
      title: 'Coming Soon!',
      description: `The interactive seat layout builder for "${eventName}" is under construction.`,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Seat Layout Builder
        </h1>
        <p className="text-muted-foreground">
          Manage seat layouts for your upcoming events.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Events</CardTitle>
          <CardDescription>
            Select an event to create or edit its seat layout. This layout will
            be available for customers during ticket purchase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventsWithLayoutStatus.map((event) => (
                <TableRow key={event.name}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    {event.hasLayout ? (
                      <Badge variant="default">Layout Created</Badge>
                    ) : (
                      <Badge variant="secondary">No Layout</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      onClick={() => handleManageLayoutClick(event.name)}
                    >
                      {event.hasLayout ? 'Edit Layout' : 'Create Layout'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
