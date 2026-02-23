import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DollarSign,
  Percent,
  TrendingUp,
  Download,
} from 'lucide-react';
import { commissionHistory } from '@/lib/data';
import CommissionChart from './commission-chart';
import { Button } from '@/components/ui/button';

export default function CommissionBreakdownPage() {
  const totalCommission = commissionHistory.reduce(
    (acc, item) => acc + item.commission,
    0
  );
  const totalRevenue = commissionHistory.reduce(
    (acc, item) => acc + item.grossSale,
    0
  );
  const platformFee =
    totalRevenue > 0 ? (totalCommission / totalRevenue) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Commission Breakdown
          </h1>
          <p className="text-muted-foreground">
            A detailed view of your earnings and our fees.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
            <p className="text-xs text-muted-foreground">
              All-time gross sales
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Commission Paid
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalCommission.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
            <p className="text-xs text-muted-foreground">
              Platform fees deducted
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Effective Fee Rate
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformFee.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Average commission rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Revenue vs. Commission</CardTitle>
            <CardDescription>
              A monthly breakdown of gross revenue and the commission paid.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <CommissionChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              A log of recent sales and their commission breakdown.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Gross</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissionHistory.slice(0, 7).map((item) => (
                  <TableRow key={item.orderId}>
                    <TableCell>
                      <div className="font-medium">{item.eventName}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      ${item.grossSale.toFixed(2)}
                    </TableCell>
                     <TableCell className="text-destructive">
                      -${item.commission.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${item.netEarning.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
