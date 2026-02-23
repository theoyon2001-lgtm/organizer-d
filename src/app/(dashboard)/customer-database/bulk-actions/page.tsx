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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Download,
  Mail,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ticketPurchases, ticketTypeSalesData } from '@/lib/data';
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

const ITEMS_PER_PAGE = 10;

type Customer = {
  name: string;
  email: string;
  avatar: string;
  totalPurchases: number;
  totalSpent: number;
  lastPurchaseDate: string;
  lastPurchaseEvent: string;
};

export default function BulkActionsPage() {
  const { toast } = useToast();
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const customerMap = new Map<
      string,
      {
        name: string;
        email: string;
        purchases: TicketPurchase[];
        avatar: string;
      }
    >();

    ticketPurchases.forEach((purchase) => {
      if (!customerMap.has(purchase.customerEmail)) {
        customerMap.set(purchase.customerEmail, {
          name: purchase.customerName,
          email: purchase.customerEmail,
          purchases: [],
          avatar: `https://i.pravatar.cc/40?u=${purchase.customerEmail}`,
        });
      }
      customerMap.get(purchase.customerEmail)!.purchases.push(purchase);
    });

    const allCustomers = Array.from(customerMap.values()).map((customer) => {
      const totalSpent = customer.purchases.reduce((acc, p) => {
        const saleInfo = ticketTypeSalesData.find(
          (s) => s.event === p.event && s.ticketType === p.ticketType
        );
        return acc + (saleInfo?.price || 0);
      }, 0);

      const lastPurchase = customer.purchases.sort(
        (a, b) =>
          new Date(b.purchaseDate).getTime() -
          new Date(a.purchaseDate).getTime()
      )[0];

      return {
        ...customer,
        totalPurchases: customer.purchases.length,
        totalSpent,
        lastPurchaseDate: lastPurchase.purchaseDate,
        lastPurchaseEvent: lastPurchase.event,
      };
    });
    setCustomers(allCustomers);
  }, []);

  const filteredCustomers = React.useMemo(() => {
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const isAllCurrentPageRowsSelected =
    currentCustomers.length > 0 &&
    currentCustomers.every((c) => selectedRowKeys.includes(c.email));

  const handleSelectAll = (checked: boolean | string) => {
    if (checked) {
      const currentPageKeys = currentCustomers.map((c) => c.email);
      setSelectedRowKeys((prev) => [...new Set([...prev, ...currentPageKeys])]);
    } else {
      const currentPageKeys = currentCustomers.map((c) => c.email);
      setSelectedRowKeys((prev) => prev.filter((k) => !currentPageKeys.includes(k)));
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
    const selected = customers.filter((c) => selectedRowKeys.includes(c.email));
    if (selected.length === 0) {
      toast({ variant: 'destructive', title: 'No customers selected' });
      return;
    }

    const headers = [
      'Name',
      'Email',
      'Avatar URL',
      'Total Purchases',
      'Total Spent ($)',
    ];
    const csvRows = selected.map((c) =>
      [
        `"${c.name}"`,
        `"${c.email}"`,
        `"${c.avatar}"`,
        c.totalPurchases,
        c.totalSpent.toFixed(2),
      ].join(',')
    );
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'selected_customers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Successful',
      description: `${selected.length} customers exported.`,
    });
  };

  const handleSendEmail = () => {
    toast({
      title: 'Action: Send Email',
      description: `An email would be sent to ${selectedRowKeys.length} customer(s).`,
    });
  };

  const handleDeleteSelected = () => {
    setCustomers((prev) => prev.filter((c) => !selectedRowKeys.includes(c.email)));
    toast({
      title: 'Customers Deleted',
      description: `${selectedRowKeys.length} customer(s) have been deleted.`,
    });
    setSelectedRowKeys([]);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulk Actions</h1>
          <p className="text-muted-foreground">
            Select customers to perform actions like exporting or deleting.
          </p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Customer List</CardTitle>
                <CardDescription>
                  {selectedRowKeys.length > 0
                    ? `${selectedRowKeys.length} of ${customers.length} customers selected.`
                    : `Select customers by using the checkboxes.`}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 sm:w-64"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={selectedRowKeys.length === 0}
                    >
                      Bulk Actions
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={handleSendEmail}>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleExportSelected}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Selected
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onSelect={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={isAllCurrentPageRowsSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Last Purchase</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCustomers.length > 0 ? (
                    currentCustomers.map((customer) => (
                      <TableRow
                        key={customer.email}
                        data-state={
                          selectedRowKeys.includes(customer.email) && 'selected'
                        }
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedRowKeys.includes(customer.email)}
                            onCheckedChange={(checked) =>
                              handleRowSelect(customer.email, checked)
                            }
                            aria-label={`Select ${customer.name}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={customer.avatar}
                                alt={customer.name}
                              />
                              <AvatarFallback>
                                {customer.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {customer.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {customer.lastPurchaseEvent}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(
                              customer.lastPurchaseDate
                            ).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          $
                          {customer.totalSpent.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No customers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-end space-x-2 pt-4">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
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
              selected {selectedRowKeys.length} customer(s) from the list.
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
