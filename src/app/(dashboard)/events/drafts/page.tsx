'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  Calendar as CalendarIcon,
  MapPin,
  Upload,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { draftEvents } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function DraftEventsPage() {
  const { toast } = useToast();

  const handlePublish = (eventName: string) => {
    toast({
      title: 'Event Published!',
      description: `${eventName} is now live.`,
    });
  };

  const handleDelete = (eventName: string) => {
    toast({
      title: 'Draft Deleted',
      description: `The draft "${eventName}" has been deleted.`,
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Draft Events</h1>
          <p className="text-muted-foreground">
            Manage and publish your saved event drafts.
          </p>
        </div>
      </div>

      {draftEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {draftEvents.map((event) => (
            <Card
              key={event.name}
              className="overflow-hidden flex flex-col group"
            >
              <CardHeader className="p-0 relative">
                <Image
                  src={
                    event.imageUrl ||
                    'https://picsum.photos/seed/placeholder/600/400'
                  }
                  alt={event.name}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                  data-ai-hint="event photo placeholder"
                />
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
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <Button onClick={() => handlePublish(event.name)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Publish
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href="/events/create">Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={() => handleDelete(event.name)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
              <h3 className="text-xl font-semibold mb-2">No Drafts Found</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any saved drafts. Start by creating a new event.
              </p>
              <Button asChild>
                <Link href="/events/create">Create Event</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
