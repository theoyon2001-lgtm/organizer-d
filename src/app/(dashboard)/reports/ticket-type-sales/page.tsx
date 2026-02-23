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
  Ticket,
  BarChart3,
  TicketPercent,
  DollarSign,
  Users,
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
import { TicketTypeSale } from '@/lib/types';
import SalesByTypeChart from './sales-by-type-chart';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function TicketTypeSalesPage() {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = React.useState('all');

  const filteredSales = React.useMemo(() => {
    if (selectedEvent === 'all') {
      return ticketTypeSalesData;
    }
    return ticketTypeSalesData.filter((sale) => sale.event === selectedEvent);
  }, [selectedEvent]);

  const stats = React.useMemo(() => {
    const totalRevenue = filteredSales.reduce(
      (sum, sale) => sum + sale.revenue,
      0
    );
    const totalTicketsSold = filteredSales.reduce(
      (sum, sale) => sum + sale.ticketsSold,
      0
    );
    const uniqueTicketTypes = new Set(filteredSales.map((sale) => sale.ticketType))
      .size;
    return { totalRevenue, totalTicketsSold, uniqueTicketTypes };
  }, [filteredSales]);

  const chartData = React.useMemo(() => {
    const dataByTicketType = filteredSales.reduce(
      (acc, sale) => {
        if (!acc[sale.ticketType]) {
          acc[sale.ticketType] = { revenue: 0, ticketType: sale.ticketType };
        }
        acc[sale.ticketType].revenue += sale.revenue;
        return acc;
      },
      {} as { [key: string]: { revenue: number; ticketType: string } }
    );

    return Object.values(dataByTicketType)
      .sort((a, b) => b.revenue - a.revenue)
      .map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length],
      }));
  }, [filteredSales]);

  const handleSalesExport = () => {
    if (filteredSales.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No data to export',
        description: 'There is no data to export for the selected filter.',
      });
      return;
    }

    const headers = [
      'Event',
      'Ticket Type',
      'Price',
      'Tickets Sold',
      'Revenue',
    ];
    const csvRows = filteredSales.map((sale) =>
      [
        `"${sale.event}"`,
        `"${sale.ticketType}"`,
        sale.price,
        sale.ticketsSold,
        `"${sale.revenue.toFixed(2)}"`,
      ].join(',')
    );

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'ticket-type-sales.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Successful',
      description: 'Your ticket type sales report has been downloaded.',
    });
  };

  const handleCustomerExport = () => {
    const customersToExport =
      selectedEvent === 'all'
        ? ticketPurchases
        : ticketPurchases.filter(
            (purchase) => purchase.event === selectedEvent
          );

    if (customersToExport.length === 0) {
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
    const csvRows = customersToExport.map((p) =>
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
          <h1 className="text-3xl font-bold tracking-tight">
            Ticket Type Sales
          </h1>
          <p className="text-muted-foreground">
            A breakdown of sales by individual ticket types.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger
              className={cn(
                'w-[280px]',
                selectedEvent !== 'all' &&
                  'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 font-medium'
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
          <Button variant="outline" onClick={handleSalesExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Sales
          </Button>
          <Button variant="outline" onClick={handleCustomerExport}>
            <Users className="mr-2 h-4 w-4" />
            Export Customers
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {stats.totalRevenue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">From selected sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tickets Sold
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalTicketsSold.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all ticket types
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
            <p className="text-xs text-muted-foreground">In selected events</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Detailed Sales by Ticket Type</CardTitle>
            <CardDescription>
              A comprehensive list of sales per ticket type for the selected
              event(s).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Ticket Type</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale, index) => (
                    <TableRow
                      key={`${sale.event}-${sale.ticketType}-${index}`}
                    >
                      <TableCell className="font-medium">{sale.event}</TableCell>
                      <TableCell>{sale.ticketType}</TableCell>
                      <TableCell className="text-right">
                        ${sale.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {sale.ticketsSold.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        $
                        {sale.revenue.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No sales data available for this filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue by Ticket Type</CardTitle>
            <CardDescription>
              A visual breakdown of revenue contributions from each ticket
              type.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <SalesByTypeChart data={chartData} />
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/20">
                <BarChart3 className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground">
                  No Chart Data
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Select an event with sales to see the chart.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
