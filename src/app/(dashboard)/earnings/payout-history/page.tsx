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
import {
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Clock,
  XCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { payoutHistory as initialPayoutHistory } from '@/lib/data';
import { Payout } from '@/lib/types';
import Invoice from './invoice';
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 8;

// Component for the Dialog Content to allow usage of hooks
const InvoiceDialogContent = ({ payout }: { payout: Payout }) => {
  const invoiceRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const node = invoiceRef.current;
    if (!node) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';

    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    if (!doc) {
      document.body.removeChild(iframe);
      return;
    }

    doc.write(`<html><head><title>Kicket-Receipt-${payout.id}</title>`);
    const links = document.head.querySelectorAll('link');
    links.forEach((link) => {
      doc.write(link.outerHTML);
    });

    const styles = document.head.querySelectorAll('style');
    styles.forEach((style) => {
      doc.write(style.outerHTML);
    });

    doc.write('</head><body>');
    doc.write(node.innerHTML);
    doc.write('</body></html>');
    doc.close();

    // Use timeout to ensure styles are loaded before printing.
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      document.body.removeChild(iframe);
    }, 500);
  };

  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Payout Receipt</DialogTitle>
        <DialogDescription>
          A detailed receipt for transaction ID: {payout.id}
        </DialogDescription>
      </DialogHeader>
      <div className="my-4 max-h-[70vh] overflow-y-auto rounded-lg border bg-gray-50">
        <Invoice ref={invoiceRef} payout={payout} />
      </div>
      <DialogFooter className="items-center sm:justify-between">
        <p className="hidden text-sm text-muted-foreground sm:block">
          You can save the receipt as a PDF from the print menu.
        </p>
        <div>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={handlePrint} className="ml-2">
            <Download className="mr-2 h-4 w-4" />
            Print / Download
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default function PayoutHistoryPage() {
  const { toast } = useToast();
  const [payouts, setPayouts] = React.useState<Payout[]>(initialPayoutHistory);
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    const storedPayouts: Payout[] = JSON.parse(
      localStorage.getItem('customPayouts') || '[]'
    );
    const combinedPayouts = [...storedPayouts, ...initialPayoutHistory];
    const uniquePayouts = combinedPayouts.filter(
      (payout, index, self) =>
        index === self.findIndex((p) => p.id === payout.id)
    );
    uniquePayouts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setPayouts(uniquePayouts);
  }, []);

  const totalPages = Math.ceil(payouts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPayouts = payouts.slice(startIndex, endIndex);

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

  const stats = React.useMemo(() => {
    const totalCompleted = payouts
      .filter((p) => p.status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingCount = payouts.filter(
      (p) => p.status === 'Pending'
    ).length;
    const failedCount = payouts.filter((p) => p.status === 'Failed').length;
    return { totalCompleted, pendingCount, failedCount };
  }, [payouts]);

  const handleExport = () => {
    if (payouts.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No data to export',
        description: 'There is no payout history to export.',
      });
      return;
    }

    const headers = ['ID', 'Date', 'Amount', 'Method', 'Status'];
    const csvRows = payouts.map((payout) =>
      [
        payout.id,
        payout.date,
        `"${payout.amount.toFixed(2)}"`,
        payout.method,
        payout.status,
      ].join(',')
    );

    const csvContent = [headers.join(','), ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'payout-history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Successful',
      description: 'Your full payout history has been downloaded.',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payout History</h1>
          <p className="text-muted-foreground">
            A detailed record of all your past payouts.
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Withdrawn
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {stats.totalCompleted.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all completed payouts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Currently being processed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payouts</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.failedCount}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Payouts</CardTitle>
          <CardDescription>
            Browse through your complete payout history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPayouts.length > 0 ? (
                  currentPayouts.map((payout: Payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">
                        {new Date(payout.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>{payout.method}</TableCell>
                      <TableCell className="text-right">
                        $
                        {payout.amount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            payout.status === 'Completed'
                              ? 'default'
                              : payout.status === 'Pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="capitalize"
                        >
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              View Receipt
                            </Button>
                          </DialogTrigger>
                          <InvoiceDialogContent payout={payout} />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No payout history found.
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
