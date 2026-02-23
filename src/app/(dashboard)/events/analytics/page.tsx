'use client';

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

const analyticsData = {
  totalTicketsSold: upcomingEvents.reduce(
    (acc, event) => acc + event.ticketsSold,
    0
  ),
  totalRevenue: upcomingEvents.reduce(
    (acc, event) => acc + event.ticketsSold * (event.price || 0),
    0
  ),
  activeEvents: upcomingEvents.filter(
    (event) => new Date(event.date) >= new Date()
  ).length,
  averageSellThrough:
    (upcomingEvents.reduce(
      (acc, event) => acc + event.ticketsSold / event.totalTickets,
      0
    ) /
      upcomingEvents.length) *
    100,
};

// Data for ticket sales by event
const eventSalesData = upcomingEvents.map((event) => ({
  name: event.name,
  'Tickets Sold': event.ticketsSold,
  'Total Tickets': event.totalTickets,
}));

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
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Event Analytics</h1>
        <p className="text-muted-foreground">
          A comprehensive overview of your event performance.
        </p>
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
            <p className="text-xs text-muted-foreground">Across all events</p>
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
            <p className="text-xs text-muted-foreground">Not yet happened</p>
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
            event.
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
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
        </CardContent>
      </Card>
    </div>
  );
}
