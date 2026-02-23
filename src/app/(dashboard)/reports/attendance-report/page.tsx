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
  UserCheck,
  Percent,
  Search,
  CheckCircle,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ticketPurchases as initialTicketPurchases,
  upcomingEvents,
} from '@/lib/data';
import { TicketPurchase } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function AttendanceReportPage() {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = React.useState(
    upcomingEvents[0]?.name || 'all'
  );
  const [searchTerm, setSearchTerm] = React.useState('');
  const [attendees, setAttendees] =
    React.useState<TicketPurchase[]>(initialTicketPurchases);

  const filteredAttendees = React.useMemo(() => {
    return attendees
      .filter((p) => selectedEvent === 'all' || p.event === selectedEvent)
      .filter(
        (p) =>
          p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [attendees, selectedEvent, searchTerm]);

  const stats = React.useMemo(() => {
    const total = filteredAttendees.length;
    const checkedIn = filteredAttendees.filter((p) => p.checkedIn).length;
    const checkInRate = total > 0 ? (checkedIn / total) * 100 : 0;
    return { total, checkedIn, checkInRate };
  }, [filteredAttendees]);

  const handleCheckIn = (purchaseId: string) => {
    setAttendees((prev) =>
      prev.map((p) =>
        p.purchaseId === purchaseId ? { ...p, checkedIn: true } : p
      )
    );
    const attendee = attendees.find((p) => p.purchaseId === purchaseId);
    if (attendee) {
      toast({
        title: 'Attendee Checked In',
        description: `${attendee.customerName} has been successfully checked in.`,
      });
    }
  };

  const handleExport = () => {
    if (filteredAttendees.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No data to export',
        description: 'There are no attendees for the current filter.',
      });
      return;
    }

    const headers = ['Name', 'Email', 'Event', 'Ticket Type', 'Status'];
    const csvRows = filteredAttendees.map((p) =>
      [
        `"${p.customerName}"`,
        `"${p.customerEmail}"`,
        `"${p.event}"`,
        `"${p.ticketType}"`,
        p.checkedIn ? 'Checked-In' : 'Not Checked-In',
      ].join(',')
    );

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `attendance-report-${selectedEvent.replace(/\s+/g, '-')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Report</h1>
        <p className="text-muted-foreground">
          Monitor and manage event check-ins.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Attendees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">For selected event</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked-In</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.checkedIn.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Confirmed attendance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-in Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.checkInRate.toFixed(1)}%
            </div>
            <Progress value={stats.checkInRate} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendee List</CardTitle>
          <CardDescription>
            Search for attendees and manage their check-in status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-full sm:w-[280px]">
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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export List
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Attendee</TableHead>
                  <TableHead>Ticket Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendees.length > 0 ? (
                  filteredAttendees.map((purchase) => (
                    <TableRow key={purchase.purchaseId}>
                      <TableCell>
                        <div className="font-medium">
                          {purchase.customerName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {purchase.customerEmail}
                        </div>
                      </TableCell>
                      <TableCell>{purchase.ticketType}</TableCell>
                      <TableCell>
                        <Badge
                          variant={purchase.checkedIn ? 'default' : 'secondary'}
                        >
                          {purchase.checkedIn
                            ? 'Checked-In'
                            : 'Not Checked-In'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleCheckIn(purchase.purchaseId)}
                          disabled={purchase.checkedIn}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Check In
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No attendees found for the selected filters.
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
