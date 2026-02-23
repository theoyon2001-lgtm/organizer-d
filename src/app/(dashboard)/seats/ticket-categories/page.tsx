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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type TicketCategory = {
  id: string;
  name: string;
  color: string;
};

const initialCategories: TicketCategory[] = [
  { id: 'tier-1', name: 'VIP', color: 'bg-purple-500' },
  { id: 'tier-2', name: 'General Admission', color: 'bg-blue-500' },
  { id: 'tier-3', name: 'Economy', color: 'bg-green-500' },
  { id: 'tier-4', name: 'Early Bird', color: 'bg-yellow-500' },
];

const colorOptions = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-teal-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
];

export default function TicketCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] =
    React.useState<TicketCategory[]>(initialCategories);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] =
    React.useState<TicketCategory | null>(null);
  const [categoryName, setCategoryName] = React.useState('');
  const [categoryColor, setCategoryColor] = React.useState(colorOptions[0]);

  const handleOpenDialog = (category: TicketCategory | null) => {
    setEditingCategory(category);
    if (category) {
      setCategoryName(category.name);
      setCategoryColor(category.color);
    } else {
      setCategoryName('');
      setCategoryColor(colorOptions[0]);
    }
    setDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!categoryName) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Category name cannot be empty.',
      });
      return;
    }

    if (editingCategory) {
      // Edit existing category
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name: categoryName, color: categoryColor }
            : c
        )
      );
      toast({
        title: 'Category Updated',
        description: `"${categoryName}" has been updated.`,
      });
    } else {
      // Add new category
      const newCategory: TicketCategory = {
        id: `cat-${Date.now()}`,
        name: categoryName,
        color: categoryColor,
      };
      setCategories([...categories, newCategory]);
      toast({
        title: 'Category Added',
        description: `"${categoryName}" has been added.`,
      });
    }
    setDialogOpen(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const categoryToDelete = categories.find((c) => c.id === categoryId);
    if (categoryToDelete) {
        setCategories(categories.filter((c) => c.id !== categoryId));
        toast({
            title: 'Category Deleted',
            description: `The category "${categoryToDelete.name}" has been deleted.`,
        });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ticket Categories</h1>
        <p className="text-muted-foreground">
          Define and manage ticket categories for your events.
        </p>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Manage Categories</CardTitle>
                <CardDescription>
                  Add, edit, or delete your ticket categories.
                </CardDescription>
              </div>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog(null)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Color</TableHead>
                  <TableHead>Category Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div
                        className={cn('h-6 w-6 rounded-full', category.color)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-right">
                       <DialogTrigger asChild>
                         <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(category)}>
                           <Edit className="h-4 w-4" />
                         </Button>
                       </DialogTrigger>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the &quot;{category.name}&quot; category. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {categories.length === 0 && (
                <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed mt-4">
                    <p className="text-muted-foreground">
                    No ticket categories found. Add one to get started.
                    </p>
                </div>
            )}
          </CardContent>
        </Card>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category's name and color."
                : 'Create a new category for your tickets.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="col-span-3"
                placeholder="e.g. VIP"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setCategoryColor(color)}
                    className={cn(
                      'h-8 w-8 rounded-full cursor-pointer border-2',
                      categoryColor === color
                        ? 'border-primary ring-2 ring-primary'
                        : 'border-transparent'
                    )}
                  >
                    <div className={cn('h-full w-full rounded-full', color)} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCategory}>Save Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
