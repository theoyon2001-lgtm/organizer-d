'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Download,
  ArrowRight,
} from 'lucide-react';
import { payoutHistory } from '@/lib/data';
import EarningsChart from './earnings-chart';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Payout } from '@/lib/types';

export default function EarningsOverviewPage() {
  const { toast } = useToast();
  const totalEarnings = 55980.5;
  const monthlyEarnings = 7850.0;
  const totalPayouts = 45231.89;
  const availableForPayout = totalEarnings - totalPayouts;

  const handleExport = (data: Payout[], fileName: string) => {
    if (data.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No data to export',
      });
      return;
    }

    const headers = ['ID', 'Date', 'Amount', 'Method', 'Status'];
    const csvRows = data.map((payout) =>
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
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Successful',
      description: 'Your payout history has been downloaded.',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Earnings Overview
          </h1>
          <p className="text-muted-foreground">
            Track earnings, request payouts, and view history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() =>
              handleExport(payoutHistory, 'recent-payouts-overview')
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button asChild>
            <Link href="/earnings/withdrawal-request">
              Request Payout <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All-time gross earnings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +${monthlyEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +15.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalPayouts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully withdrawn
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Available for Payout
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${availableForPayout.toLocaleString()}
            </div>
            <p className="text-xs text-primary/80">Ready for withdrawal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>
              A breakdown of your gross revenue per month for the last year.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <EarningsChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Payouts</CardTitle>
            <CardDescription>Your last few payouts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payoutHistory.slice(0, 5).map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>
                      <div className="font-medium">
                        {new Date(payout.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {payout.method}
                      </div>
                    </TableCell>
                    <TableCell>${payout.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          payout.status === 'Completed'
                            ? 'default'
                            : payout.status === 'Pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {payout.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="justify-end">
            <Button asChild variant="ghost" size="sm">
              <Link href="/earnings/payout-history">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
