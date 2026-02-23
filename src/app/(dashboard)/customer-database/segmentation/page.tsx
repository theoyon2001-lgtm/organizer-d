'use client';

import * as React from 'react';
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
import {
  Download,
  Users,
  Ticket,
  CalendarCheck,
  Filter,
  TicketPercent,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ticketPurchases, upcomingEvents } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import type { TicketPurchase } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function SegmentationPage() {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = React.useState(
    upcomingEvents[0]?.name || 'all'
  );
  const [selectedTicketType, setSelectedTicketType] = React.useState('all');

  // When event filter changes, reset ticket type filter
  React.useEffect(() => {
    setSelectedTicketType('all');
  }, [selectedEvent]);

  const availableTicketTypes = React.useMemo(() => {
    if (selectedEvent === 'all') {
      return [];
    }
    const types = ticketPurchases
      .filter((purchase) => purchase.event === selectedEvent)
      .map((purchase) => purchase.ticketType);
    return [...new Set(types)];
  }, [selectedEvent]);

  const filteredCustomers = React.useMemo(() => {
    return ticketPurchases.filter((purchase) => {
      const eventMatch =
        selectedEvent === 'all' || purchase.event === selectedEvent;
      const ticketTypeMatch =
        selectedTicketType === 'all' ||
        purchase.ticketType === selectedTicketType;
      return eventMatch && ticketTypeMatch;
    });
  }, [selectedEvent, selectedTicketType]);

  const stats = React.useMemo(() => {
    const totalCustomers = filteredCustomers.length;
    const uniqueTicketTypes = new Set(
      filteredCustomers.map((c) => c.ticketType)
    ).size;
    const eventName = selectedEvent === 'all' ? 'All Events' : selectedEvent;
    return { totalCustomers, uniqueTicketTypes, eventName };
  }, [filteredCustomers, selectedEvent]);

  const handleExport = () => {
    if (filteredCustomers.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No data to export',
      });
      return;
    }

    const headers = [
      'Name',
      'Email',
      'Avatar URL',
      'Event',
      'Ticket Type',
      'Purchase Date',
    ];
    const csvRows = filteredCustomers.map((p) =>
      [
        `"${p.customerName}"`,
        `"${p.customerEmail}"`,
        `"https://i.pravatar.cc/40?u=${p.customerEmail}"`,
        `"${p.event}"`,
        `"${p.ticketType}"`,
        p.purchaseDate,
      ].join(',')
    );

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `customer-segment-${selectedEvent.replace(/\s+/g, '-')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Successful',
      description: 'The customer list has been downloaded.',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Customer Segmentation
        </h1>
        <p className="text-muted-foreground">
          Filter and view customer lists by event and ticket type.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Filtered Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalCustomers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Matching selection</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="truncate text-lg font-bold">{stats.eventName}</div>
            <p className="text-xs text-muted-foreground">
              Currently selected event
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Types</CardTitle>
            <TicketPercent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.uniqueTicketTypes}
            </div>
            <p className="text-xs text-muted-foreground">In this segment</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Filtered Customer List</CardTitle>
              <CardDescription>
                Select filters to view the list of customers who made a
                purchase.
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export List
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2 font-semibold text-muted-foreground">
              <Filter className="h-5 w-5" />
              <span>Filters:</span>
            </div>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger
                className={cn(
                  'w-full sm:w-[280px]',
                  selectedEvent !== 'all' &&
                    'border-primary/30 bg-primary/5 font-medium text-primary hover:bg-primary/10'
                )}
              >
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {upcomingEvents.map((event) => (
                  <SelectItem key={event.id} value={event.name}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedTicketType}
              onValueChange={setSelectedTicketType}
              disabled={selectedEvent === 'all'}
            >
              <SelectTrigger
                className="w-full sm:w-[280px]"
                disabled={selectedEvent === 'all'}
              >
                <SelectValue placeholder="Filter by ticket type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ticket Types</SelectItem>
                {availableTicketTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Ticket Type</TableHead>
                  <TableHead className="text-right">Purchase Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((purchase: TicketPurchase) => (
                    <TableRow key={purchase.purchaseId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`https://i.pravatar.cc/40?u=${purchase.customerEmail}`}
                              alt={purchase.customerName}
                            />
                            <AvatarFallback>
                              {purchase.customerName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {purchase.customerName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {purchase.customerEmail}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{purchase.event}</TableCell>
                      <TableCell>{purchase.ticketType}</TableCell>
                      <TableCell className="text-right">
                        {new Date(purchase.purchaseDate).toLocaleDateString(
                          'en-US',
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No customers found for the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
