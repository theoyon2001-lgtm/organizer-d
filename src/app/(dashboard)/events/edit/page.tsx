import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  PlusCircle,
  Calendar as CalendarIcon,
  MapPin,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { upcomingEvents } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';

export default function AllEventsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Events</h1>
          <p className="text-muted-foreground">
            View and manage all of your events.
          </p>
        </div>
        <Button asChild>
          <Link href="/events/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {upcomingEvents.map((event) => (
          <Card key={event.name} className="overflow-hidden flex flex-col group">
            <CardHeader className="p-0 relative">
              <Image
                src={
                  event.imageUrl ||
                  'https://picsum.photos/seed/placeholder/600/400'
                }
                alt={event.name}
                width={600}
                height={400}
                className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="event photo"
              />
              <Badge
                className="absolute top-2 right-2"
                variant={
                  new Date(event.date).getTime() > new Date().getTime()
                    ? 'default'
                    : 'secondary'
                }
              >
                {new Date(event.date).getTime() > new Date().getTime()
                  ? 'Upcoming'
                  : 'Past'}
              </Badge>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle className="text-lg mb-2 leading-tight h-12">
                {event.name}
              </CardTitle>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                  <span>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-3 p-4 pt-0">
              <div className="w-full">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>
                    {event.ticketsSold.toLocaleString()} /{' '}
                    {event.totalTickets.toLocaleString()} sold
                  </span>
                  <span>
                    {((event.ticketsSold / event.totalTickets) * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress
                  value={(event.ticketsSold / event.totalTickets) * 100}
                  className="h-2"
                />
              </div>

              <div className="flex w-full items-center justify-end -mb-2 -mr-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Clone</DropdownMenuItem>
                    <DropdownMenuItem>View Analytics</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
