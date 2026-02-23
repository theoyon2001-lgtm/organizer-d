'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  ticketPurchases,
  ticketTypeSalesData,
} from '@/lib/data';
import {
  History,
  Trash2,
  RotateCw,
  HardDriveDownload,
  UploadCloud,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TicketPurchase } from '@/lib/types';

type Customer = {
  name: string;
  email: string;
  avatar: string;
  totalPurchases: number;
  totalSpent: number;
  lastPurchaseDate: string;
  lastPurchaseEvent: string;
};

type Backup = {
  id: string;
  createdAt: string;
  customerCount: number;
  data: Customer[];
};

export default function BackupRestorePage() {
  const { toast } = useToast();
  const [backups, setBackups] = React.useState<Backup[]>([]);
  const [isCreatingBackup, setIsCreatingBackup] = React.useState(false);

  // Load backups from localStorage on mount
  React.useEffect(() => {
    try {
      const savedBackups = localStorage.getItem('customerDBBackups');
      if (savedBackups) {
        setBackups(JSON.parse(savedBackups));
      }
    } catch (error) {
      console.error('Failed to load backups from localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Error loading backups',
        description: 'Could not load backup history from your browser.',
      });
    }
  }, [toast]);

  // Function to get all unique customers
  const getAllCustomers = React.useCallback(() => {
    const customerMap = new Map<
      string,
      { name: string; email: string; purchases: TicketPurchase[]; avatar: string }
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

  const handleCreateBackup = () => {
    setIsCreatingBackup(true);

    // Simulate async operation
    setTimeout(() => {
      const allCustomers = getAllCustomers();
      const newBackup: Backup = {
        id: `backup-${Date.now()}`,
        createdAt: new Date().toISOString(),
        customerCount: allCustomers.length,
        data: allCustomers,
      };

      const updatedBackups = [newBackup, ...backups];
      setBackups(updatedBackups);
      try {
        localStorage.setItem('customerDBBackups', JSON.stringify(updatedBackups));
        toast({
          title: 'Backup Successful',
          description: `Created a backup with ${allCustomers.length} customer records.`,
        });
      } catch (error) {
        console.error('Failed to save backup to localStorage', error);
        toast({
          variant: 'destructive',
          title: 'Backup Failed',
          description: 'Could not save the backup to your browser storage.',
        });
      } finally {
        setIsCreatingBackup(false);
      }
    }, 1500); // Simulate network delay
  };

  const handleDownloadBackup = (backup: Backup) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(backup.data, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `${backup.id}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast({
      title: 'Download Started',
      description: `Backup ${backup.id} is being downloaded.`,
    });
  };

  const handleRestore = (backup: Backup) => {
    // In a real app, this would involve an API call to replace the database.
    // Here we'll just show a toast.
    toast({
      title: 'Restore Initiated',
      description: `Restoring database from backup ${backup.id}. This is a simulated action.`,
    });
  };

  const handleDeleteBackup = (backupId: string) => {
    const updatedBackups = backups.filter((b) => b.id !== backupId);
    setBackups(updatedBackups);
    try {
      localStorage.setItem('customerDBBackups', JSON.stringify(updatedBackups));
      toast({
        title: 'Backup Deleted',
        description: `Backup ${backupId} has been removed.`,
      });
    } catch (error) {
      console.error('Failed to update backups in localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: 'Could not update the backup history in your browser.',
      });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Backup & Restore</h1>
        <p className="text-muted-foreground">
          Manage your customer database snapshots.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Backup</CardTitle>
          <CardDescription>
            Create a point-in-time snapshot of your customer database. Backups
            are stored locally in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This will back up all unique customer profiles based on the current
            purchase history.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateBackup} disabled={isCreatingBackup}>
            {isCreatingBackup ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Create Backup
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>
                Restore, download, or delete previous backups.
              </CardDescription>
            </div>
            <History className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Backup ID</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead className="text-center">Customers</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.length > 0 ? (
                  backups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell className="font-mono">{backup.id}</TableCell>
                      <TableCell>
                        {new Date(backup.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {backup.customerCount}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="outline" size="sm">
                              <RotateCw className="mr-2 h-4 w-4" />
                              Restore
                            </Button>
                          </AlertDialogTrigger>
                           <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure you want to restore?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will overwrite your current data with the data from this backup. This action cannot be undone. For this demo, this is a simulated action.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRestore(backup)}>
                                Proceed to Restore
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadBackup(backup)}
                        >
                          <HardDriveDownload className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                         <AlertDialog>
                           <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                           </AlertDialogTrigger>
                           <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this backup file.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteBackup(backup.id)}>
                                Delete Backup
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                         </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No backups found. Create one to get started.
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
