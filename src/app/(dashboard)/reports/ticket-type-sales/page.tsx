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
import {
  ticketTypeSalesData,
  upcomingEvents,
  ticketPurchases,
} from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function TicketTypeSalesPage() {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = React.useState('all');
  const [selectedTicketType, setSelectedTicketType] = React.useState('all');

  // When event filter changes, reset ticket type filter
  React.useEffect(() => {
    setSelectedTicketType('all');
  }, [selectedEvent]);

  const availableTicketTypes = React.useMemo(() => {
    if (selectedEvent === 'all') {
      return [];
    }
    const types = ticketTypeSalesData
      .filter((sale) => sale.event === selectedEvent)
      .map((sale) => sale.ticketType);
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
    const uniqueEvents = new Set(filteredCustomers.map((c) => c.event)).size;
    const uniqueTicketTypes = new Set(
      filteredCustomers.map((c) => c.ticketType)
    ).size;
    return { totalCustomers, uniqueEvents, uniqueTicketTypes };
  }, [filteredCustomers]);

  const handleCustomerExport = () => {
    if (filteredCustomers.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No customer data to export',
        description: 'There are no customer records for the selected filter.',
      });
      return;
    }

    const headers = [
      'Customer Name',
      'Email',
      'Event',
      'Ticket Type',
      'Purchase Date',
    ];
    const csvRows = filteredCustomers.map((p) =>
      [
        `"${p.customerName}"`,
        `"${p.customerEmail}"`,
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
      `customer-data-${selectedEvent.replace(/\s+/g, '-')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Successful',
      description: 'The customer data has been downloaded.',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Data</h1>
          <p className="text-muted-foreground">
            Filter and export customer lists by event and ticket type.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCustomerExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Customers
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalCustomers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Matching current filter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.uniqueEvents.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Represented in selection
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Types</CardTitle>
            <TicketPercent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueTicketTypes}</div>
            <p className="text-xs text-muted-foreground">In current selection</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            A detailed list of customers who purchased tickets. Use the filters
            below to refine your search.
          </CardDescription>
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
                <SelectValue placeholder="Filter by event" />
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
              <SelectTrigger className="w-full sm:w-[280px]">
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
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Ticket Type</TableHead>
                  <TableHead className="text-right">Purchase Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((purchase) => (
                    <TableRow key={purchase.purchaseId}>
                      <TableCell className="font-medium">
                        {purchase.customerName}
                      </TableCell>
                      <TableCell>{purchase.customerEmail}</TableCell>
                      <TableCell>{purchase.event}</TableCell>
                      <TableCell>{purchase.ticketType}</TableCell>
                      <TableCell className="text-right">
                        {purchase.purchaseDate}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center"
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
