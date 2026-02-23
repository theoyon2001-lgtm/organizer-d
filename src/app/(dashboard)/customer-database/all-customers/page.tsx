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
import {
  Download,
  Search,
  Users,
  DollarSign,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  ticketPurchases,
  ticketTypeSalesData,
} from '@/lib/data';
import { TicketPurchase } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

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

export default function AllCustomersPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);

  const uniqueCustomers = React.useMemo(() => {
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

    return Array.from(customerMap.values()).map((customer) => {
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
  }, []);

  const filteredCustomers = React.useMemo(() => {
    return uniqueCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [uniqueCustomers, searchTerm]);
  
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  const stats = React.useMemo(() => {
    const totalCustomers = uniqueCustomers.length;
    const totalRevenue = uniqueCustomers.reduce(
      (sum, c) => sum + c.totalSpent,
      0
    );
    const averageRevenue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
    return { totalCustomers, totalRevenue, averageRevenue };
  }, [uniqueCustomers]);

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
      'Total Purchases',
      'Total Spent ($)',
      'Last Purchase Date',
      'Last Purchase Event',
    ];
    const csvRows = filteredCustomers.map((c) =>
      [
        `"${c.name}"`,
        `"${c.email}"`,
        `"${c.avatar}"`,
        c.totalPurchases,
        c.totalSpent.toFixed(2),
        c.lastPurchaseDate,
        `"${c.lastPurchaseEvent}"`,
      ].join(',')
    );

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'all_customers_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Successful',
      description: 'Your customer data has been downloaded.',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Customers</h1>
        <p className="text-muted-foreground">
          View and manage your entire customer base.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Unique Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalCustomers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all events
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lifetime Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </div>
            <p className="text-xs text-muted-foreground">
              Total revenue from all customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Revenue per Customer
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.averageRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </div>
            <p className="text-xs text-muted-foreground">
              Average customer lifetime value
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>
                Search and browse all your customers.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead className="text-center">Total Purchases</TableHead>
                  <TableHead>Last Purchase</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCustomers.length > 0 ? (
                  currentCustomers.map((customer: Customer) => (
                    <TableRow key={customer.email}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={customer.avatar} alt={customer.name} />
                            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${customer.totalSpent.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </TableCell>
                      <TableCell className="text-center">
                        {customer.totalPurchases}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{customer.lastPurchaseEvent}</div>
                        <div className="text-sm text-muted-foreground">{new Date(customer.lastPurchaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
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
  );
}
