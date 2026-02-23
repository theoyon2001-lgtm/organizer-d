'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { upcomingEvents } from '@/lib/data';
import { Armchair, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mocking seat layout data that would normally come from a database
// In a real app, this would be associated with each event.
const mockLayouts = {
  'winter-wonderfest': {
    sections: [
      {
        id: 'section-1',
        name: 'Ice Rink-Side',
        rows: 6,
        cols: 12,
        seats: Array.from({ length: 72 }, (_, i) => ({
          id: `s1-seat-${i}`,
          label: `${i + 1}`,
          status: i % 5 === 0 ? 'booked' : 'available',
        })),
      },
    ],
  },
  'spring-bloom-festival': {
     sections: [
      {
        id: 'section-1',
        name: 'Garden View',
        rows: 8,
        cols: 15,
        seats: Array.from({ length: 120 }, (_, i) => ({
          id: `s1-seat-${i}`,
          label: `${i + 1}`,
          status: i % 3 === 0 ? 'booked' : 'available',
        })),
      },
    ],
  },
  'indie-film-showcase': null,
  'summer-music-festival': {
    sections: [
      {
        id: 'section-1',
        name: 'Front Row',
        rows: 5,
        cols: 10,
        seats: Array.from({ length: 50 }, (_, i) => ({
          id: `s1-seat-${i}`,
          label: `${i + 1}`,
          status: i % 4 === 0 ? 'booked' : 'available',
        })),
      },
      {
        id: 'section-2',
        name: 'General Admission',
        rows: 10,
        cols: 20,
        seats: Array.from({ length: 200 }, (_, i) => ({
          id: `s2-seat-${i}`,
          label: `${i + 1}`,
          status: i % 3 === 0 ? 'booked' : 'available',
        })),
      },
    ],
  },
  'tech-conference-2024': {
    sections: [
       {
        id: 'section-1',
        name: 'VIP',
        rows: 4,
        cols: 8,
        seats: Array.from({ length: 32 }, (_, i) => ({
          id: `s1-seat-${i}`,
          label: `V${i + 1}`,
          status: i % 2 === 0 ? 'booked' : 'available',
        })),
      },
       {
        id: 'section-2',
        name: 'Main Hall',
        rows: 15,
        cols: 25,
        seats: Array.from({ length: 375 }, (_, i) => ({
          id: `s2-seat-${i}`,
          label: `${i + 1}`,
          status: i % 5 === 0 ? 'booked' : 'available',
        })),
      },
    ],
  },
  'art-wine-fair': null, // Event with no layout
  'marathon-of-hope': null,
  'oktoberfest-celebration': {
     sections: [
      {
        id: 'section-1',
        name: 'Biergarten Tables',
        rows: 10,
        cols: 10,
        seats: Array.from({ length: 100 }, (_, i) => ({
          id: `s1-seat-${i}`,
          label: `T${i + 1}`,
          status: i % 2 === 0 ? 'booked' : 'available',
        })),
      },
    ],
  },
};

type SeatStatus = 'available' | 'booked' | 'unavailable';
type Seat = { id: string; label: string; status: SeatStatus };
type Section = { id: string; name: string; rows: number; cols: number; seats: Seat[] };
type Layout = { sections: Section[] } | null;

export default function SeatAvailabilityPage() {
  const [selectedEventId, setSelectedEventId] = React.useState<string | undefined>(upcomingEvents[0].id);

  const selectedEvent = upcomingEvents.find(e => e.id === selectedEventId);
  // This is a client component, so we can safely cast.
  const layout: Layout = (mockLayouts as any)[selectedEventId!] ?? null;

  const stats = React.useMemo(() => {
    if (!layout) return { total: 0, booked: 0, available: 0 };
    const allSeats = layout.sections.flatMap(s => s.seats);
    const total = allSeats.length;
    const booked = allSeats.filter(s => s.status === 'booked').length;
    const available = total - booked;
    return { total, booked, available };
  }, [layout]);


  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Seat Availability</h1>
        <p className="text-muted-foreground">
          View real-time seat availability for your events.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Selection</CardTitle>
          <CardDescription>
            Choose an event to view its seat availability map.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedEventId} value={selectedEventId}>
            <SelectTrigger className="w-full md:w-1/2 lg:w-1/3">
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {upcomingEvents.map(event => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      {selectedEvent && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedEvent.name} - Status</CardTitle>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-2">
                    <Armchair className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Available: {stats.available}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Armchair className="h-4 w-4 text-destructive" />
                    <span className="font-medium">Booked: {stats.booked}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Total Capacity:</span>
                    <span className="font-medium">{stats.total} Seats</span>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            {layout ? (
              <div className="relative w-full p-4 bg-muted/30 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-4">
                <div className="w-full h-12 bg-muted rounded-md flex items-center justify-center mb-8 shadow-inner">
                  <p className="font-bold text-muted-foreground tracking-widest text-lg">STAGE</p>
                </div>
                <div className="w-full space-y-8">
                    {layout.sections.map(section => (
                      <div key={section.id} className="p-4 rounded-lg">
                        <h3 className="font-semibold text-xl mb-4 text-center text-foreground">{section.name}</h3>
                        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${section.cols}, minmax(0, 1fr))` }}>
                          {section.seats.map(seat => {
                             let colorClass = 'text-muted-foreground/30';
                             if (seat.status === 'available') {
                                colorClass = 'text-green-600';
                             } else if (seat.status === 'booked') {
                                 colorClass = 'text-destructive';
                             }

                            return (
                              <div key={seat.id} className="aspect-square flex items-center justify-center rounded-md" title={`Seat ${seat.label}`}>
                                <Armchair className={cn("h-5 w-5", colorClass)} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
            ) : (
                <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/20">
                    <BarChart3 className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground">No Seat Layout Found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        A seat layout has not been created for this event yet.
                    </p>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
