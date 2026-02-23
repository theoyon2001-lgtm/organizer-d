'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  DollarSign,
  Ticket,
  Calendar as CalendarIcon,
  Percent,
} from 'lucide-react';
import { upcomingEvents } from '@/lib/data';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { DateRange } from 'react-day-picker';
import { format, subDays } from 'date-fns';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const chartConfig = {
  'Tickets Sold': {
    label: 'Tickets Sold',
    color: 'hsl(var(--primary))',
  },
  'Total Tickets': {
    label: 'Total Tickets',
    color: 'hsl(var(--muted))',
  },
};

export default function AnalyticsPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 365),
    to: new Date(),
  });

  const handlePreset = (preset: 'daily' | 'weekly' | 'yearly') => {
    const to = new Date();
    let from;
    if (preset === 'daily') {
      from = to;
    } else if (preset === 'weekly') {
      from = subDays(to, 6);
    } else if (preset === 'yearly') {
      from = subDays(to, 364);
    }
    setDate({ from, to });
  };

  const filteredEvents = React.useMemo(() => {
    if (!date?.from) return [];
    const to = date.to ?? date.from;
    return upcomingEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= date.from! && eventDate <= to;
    });
  }, [date]);

  const analyticsData = React.useMemo(() => {
    const totalTicketsSold = filteredEvents.reduce(
      (acc, event) => acc + event.ticketsSold,
      0
    );
    const totalRevenue = filteredEvents.reduce(
      (acc, event) => acc + event.ticketsSold * (event.price || 0),
      0
    );
    const activeEvents = filteredEvents.filter(
      (event) => new Date(event.date) >= new Date()
    ).length;
    const averageSellThrough =
      filteredEvents.length > 0
        ? (filteredEvents.reduce(
            (acc, event) => acc + event.ticketsSold / event.totalTickets,
            0
          ) /
            filteredEvents.length) *
          100
        : 0;

    return {
      totalTicketsSold,
      totalRevenue,
      activeEvents,
      averageSellThrough,
    };
  }, [filteredEvents]);

  const eventSalesData = React.useMemo(
    () =>
      filteredEvents.map((event) => ({
        name: event.name,
        'Tickets Sold': event.ticketsSold,
        'Total Tickets': event.totalTickets,
      })),
    [filteredEvents]
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Analytics</h1>
          <p className="text-muted-foreground">
            A comprehensive overview of your event performance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tabs defaultValue="yearly" className="space-y-4">
            <TabsList>
              <TabsTrigger value="daily" onClick={() => handlePreset('daily')}>
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly" onClick={() => handlePreset('weekly')}>
                Weekly
              </TabsTrigger>
              <TabsTrigger value="yearly" onClick={() => handlePreset('yearly')}>
                Yearly
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className={cn(
                  'w-full sm:w-[260px] justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'LLL dd, y')} -{' '}
                      {format(date.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(date.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tickets Sold
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.totalTicketsSold.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {analyticsData.totalRevenue.toLocaleString('en-US', {
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated from ticket sales
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.activeEvents}
            </div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Sell-through Rate
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.averageSellThrough.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Tickets sold vs. available
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Sales by Event</CardTitle>
          <CardDescription>
            Comparison of tickets sold versus total tickets available for each
            event in the selected period.
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          {eventSalesData.length > 0 ? (
            <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
              <BarChart
                data={eventSalesData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  interval={0}
                />
                <YAxis
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                  content={<ChartTooltipContent />}
                />
                <Legend />
                <Bar
                  dataKey="Tickets Sold"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Total Tickets"
                  fill="hsl(var(--muted))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
              <p className="text-muted-foreground">
                No event data for the selected period.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
