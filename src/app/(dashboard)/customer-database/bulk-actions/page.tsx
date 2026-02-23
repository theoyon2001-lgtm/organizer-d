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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Filter,
  Search,
  Users,
  Info,
  Ticket,
  CheckCircle2,
  MoreVertical,
  Mail,
  Download,
  Trash2,
  Clock,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  ticketPurchases as allTicketPurchases,
  upcomingEvents,
} from '@/lib/data';
import { TicketPurchase } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function BulkActionsPage() {
  const { toast } = useToast();
  const [attendees, setAttendees] =
    React.useState<TicketPurchase[]>(allTicketPurchases);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedEventId, setSelectedEventId] = React.useState<string>(
    upcomingEvents[0].id
  );

  const selectedEvent = React.useMemo(() => {
    return upcomingEvents.find((event) => event.id === selectedEventId);
  }, [selectedEventId]);

  const filteredAttendees = React.useMemo(() => {
    if (!selectedEvent) return [];
    return attendees
      .filter((attendee) => attendee.event === selectedEvent?.name)
      .filter(
        (attendee) =>
          attendee.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          attendee.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [attendees, selectedEvent, searchTerm]);

  const isAllRowsSelected =
    filteredAttendees.length > 0 &&
    filteredAttendees.every((c) => selectedRowKeys.includes(c.purchaseId));

  const handleSelectAll = (checked: boolean | string) => {
    if (checked) {
      const currentPageKeys = filteredAttendees.map((c) => c.purchaseId);
      setSelectedRowKeys(currentPageKeys);
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleRowSelect = (key: string, checked: boolean | string) => {
    setSelectedRowKeys((prev) => {
      if (checked) {
        return [...prev, key];
      } else {
        return prev.filter((k) => k !== key);
      }
    });
  };

  const handleExportSelected = () => {
    const selected = attendees.filter((c) =>
      selectedRowKeys.includes(c.purchaseId)
    );
    if (selected.length === 0) {
      toast({ variant: 'destructive', title: 'No attendees selected' });
      return;
    }

    const headers = [
      'Name',
      'Email',
      'Event',
      'Ticket Type',
      'Registration Date',
      'Fulfillment Status',
    ];
    const csvRows = selected.map((c) =>
      [
        `"${c.customerName}"`,
        `"${c.customerEmail}"`,
        `"${c.event}"`,
        `"${c.ticketType}"`,
        c.purchaseDate,
        c.checkedIn ? 'Confirmed' : 'Pending',
      ].join(',')
    );
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'selected_attendees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Successful',
      description: `${selected.length} attendees exported.`,
    });
  };

  const handleSendEmail = () => {
    toast({
      title: 'Action: Send Email',
      description: `An email would be sent to ${selectedRowKeys.length} attendee(s).`,
    });
  };

  const handleDeleteSelected = () => {
    setAttendees((prev) =>
      prev.filter((c) => !selectedRowKeys.includes(c.purchaseId))
    );
    toast({
      title: 'Attendees Deleted',
      description: `${selectedRowKeys.length} attendee(s) have been deleted.`,
    });
    setSelectedRowKeys([]);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Client Command Center
            </h1>
            <p className="text-muted-foreground">
              Perform high-velocity bulk operations on your event attendees.
            </p>
          </div>
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" />
            {filteredAttendees.length} Attendees Found
          </Button>
        </div>

        <Card className="p-4">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="flex items-center gap-2 self-start text-sm font-semibold text-muted-foreground md:self-center">
              <Filter className="h-5 w-5" />
              FILTERS:
            </div>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {upcomingEvents.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    <div className="flex flex-col">
                      <span>{event.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative w-full flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Client Directory</CardTitle>
                <CardDescription>
                  Select clients to reveal the bulk action command bar.
                </CardDescription>
              </div>
              {selectedEvent && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground sm:mt-0">
                  <Info className="h-4 w-4" />
                  <span>
                    SHOWING RESULTS FOR {selectedEvent.name.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px] pl-4">
                      <Checkbox
                        checked={isAllRowsSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>Client Identity</TableHead>
                    <TableHead>Ticket Type</TableHead>
                    <TableHead>Fulfillment Status</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead className="text-right">
                      Individual Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendees.length > 0 ? (
                    filteredAttendees.map((attendee) => (
                      <TableRow
                        key={attendee.purchaseId}
                        data-state={
                          selectedRowKeys.includes(attendee.purchaseId) &&
                          'selected'
                        }
                      >
                        <TableCell className="pl-4">
                          <Checkbox
                            checked={selectedRowKeys.includes(
                              attendee.purchaseId
                            )}
                            onCheckedChange={(checked) =>
                              handleRowSelect(attendee.purchaseId, checked)
                            }
                            aria-label={`Select ${attendee.customerName}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {attendee.customerName}
                            </div>
                            <div className="text-sm uppercase text-muted-foreground">
                              {attendee.customerEmail}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-medium">
                            <Ticket className="mr-2 h-4 w-4" />
                            {attendee.ticketType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              'border-transparent font-semibold',
                              attendee.checkedIn
                                ? 'bg-success/20 text-success hover:bg-success/30'
                                : 'bg-accent/20 text-accent hover:bg-accent/30'
                            )}
                          >
                            {attendee.checkedIn ? (
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                            ) : (
                              <Clock className="mr-2 h-4 w-4" />
                            )}
                            {attendee.checkedIn ? 'Confirmed' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(attendee.purchaseDate).toLocaleDateString(
                            'en-CA'
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>
                                Resend Confirmation
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Cancel Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No attendees found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Action Bar */}
      <div
        className={cn(
          'fixed bottom-4 right-1/2 z-50 translate-x-1/2 transform transition-all duration-300',
          selectedRowKeys.length > 0
            ? 'translate-y-0 opacity-100'
            : 'translate-y-24 opacity-0'
        )}
      >
        <Card className="flex items-center gap-4 p-3 shadow-2xl">
          <div className="text-sm font-semibold">
            {selectedRowKeys.length} selected
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleSendEmail}>
              <Mail className="mr-2 h-4 w-4" /> Email
            </Button>
            <Button variant="ghost" size="sm" onClick={handleExportSelected}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </Card>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected {selectedRowKeys.length} attendee(s) from the list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSelected}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
