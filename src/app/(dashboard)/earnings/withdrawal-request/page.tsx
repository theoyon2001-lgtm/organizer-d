'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Landmark,
  MessageSquare,
  Smartphone,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Payout } from '@/lib/types';

const availableForPayout = 10748.61;
const mobileBankingMethods = ['bKash', 'Nagad', 'Rocket', 'Upay'] as const;

const formSchema = z
  .object({
    amount: z.coerce
      .number()
      .positive('Please enter a valid amount.')
      .max(
        availableForPayout,
        `Withdrawal amount cannot exceed available balance.`
      ),
    note: z.string().optional(),
    payoutMethod: z.enum(['bank', 'mobile'], {
      required_error: 'You need to select a payout method.',
    }),
    accountHolderName: z.string().optional(),
    accountNumber: z.string().optional(),
    branchAddress: z.string().optional(),
    mobileMethod: z.enum(mobileBankingMethods).optional(),
    mobileNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.payoutMethod === 'bank') {
      if (!data.accountHolderName || data.accountHolderName.length < 2) {
        ctx.addIssue({
          code: 'custom',
          message: 'Account holder name is required.',
          path: ['accountHolderName'],
        });
      }
      if (!data.accountNumber || data.accountNumber.length < 5) {
        ctx.addIssue({
          code: 'custom',
          message: 'A valid account number is required.',
          path: ['accountNumber'],
        });
      }
      if (!data.branchAddress || data.branchAddress.length < 5) {
        ctx.addIssue({
          code: 'custom',
          message: 'Branch address is required.',
          path: ['branchAddress'],
        });
      }
    }
    if (data.payoutMethod === 'mobile') {
      if (!data.mobileMethod) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please select a mobile banking service.',
          path: ['mobileMethod'],
        });
      }
      if (!data.mobileNumber || data.mobileNumber.length < 10) {
        ctx.addIssue({
          code: 'custom',
          message: 'A valid mobile number is required.',
          path: ['mobileNumber'],
        });
      }
    }
  });

export default function WithdrawalRequestPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      note: '',
    },
  });

  const watchedMethod = form.watch('payoutMethod');
  const watchedMobileMethod = form.watch('mobileMethod');

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newPayout: Payout = {
      id: `payout-${Date.now()}`,
      date: new Date().toISOString(),
      amount: values.amount,
      method:
        values.payoutMethod === 'bank'
          ? 'Bank Transfer'
          : values.mobileMethod || 'Mobile Banking',
      status: 'Pending',
    };

    try {
      const storedPayouts: Payout[] = JSON.parse(
        localStorage.getItem('customPayouts') || '[]'
      );
      const updatedPayouts = [newPayout, ...storedPayouts];
      localStorage.setItem('customPayouts', JSON.stringify(updatedPayouts));
    } catch (error) {
      console.error('Failed to save payout to localStorage', error);
    }

    toast({
      title: 'Withdrawal Request Submitted',
      description: `Your request to withdraw $${values.amount.toFixed(
        2
      )} has been received.`,
    });
    router.push('/earnings/payout-history');
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/earnings/overview">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Request a Payout
          </h1>
          <p className="text-muted-foreground">
            Withdraw your available earnings to your preferred account.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Withdrawal Details</CardTitle>
                  <CardDescription>
                    Specify the amount and select your payout method.
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Available Balance
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    ${availableForPayout.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount to Withdraw ($)</FormLabel>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 500.00"
                          {...field}
                          className="pl-10"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (Optional)</FormLabel>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-primary" />
                      <FormControl>
                        <Textarea
                          placeholder="Add a note for your reference..."
                          className="resize-none pl-10"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payoutMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Payout Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Reset other method's fields to avoid submitting incorrect data
                          form.setValue('mobileMethod', undefined);
                          form.setValue('mobileNumber', '');
                          form.setValue('accountHolderName', '');
                          form.setValue('accountNumber', '');
                          form.setValue('branchAddress', '');
                        }}
                        defaultValue={field.value}
                        className="grid grid-cols-1 gap-4 md:grid-cols-2"
                      >
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem
                              value="bank"
                              className="sr-only"
                              id="bank"
                            />
                          </FormControl>
                          <Label
                            htmlFor="bank"
                            className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 text-muted-foreground transition-colors hover:bg-primary/5 hover:border-primary/20 hover:text-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 [&:has([data-state=checked])]:text-primary"
                          >
                            <Landmark className="mb-3 h-6 w-6" />
                            Bank Transfer
                          </Label>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem
                              value="mobile"
                              className="sr-only"
                              id="mobile"
                            />
                          </FormControl>
                          <Label
                            htmlFor="mobile"
                            className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 text-muted-foreground transition-colors hover:bg-primary/5 hover:border-primary/20 hover:text-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 [&:has([data-state=checked])]:text-primary"
                          >
                            <Smartphone className="mb-3 h-6 w-6" />
                            Mobile Banking
                          </Label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchedMethod === 'bank' && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Bank Account Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="accountHolderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Holder Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input placeholder="1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="branchAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Main St, Anytown, USA"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {watchedMethod === 'mobile' && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Mobile Banking Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="mobileMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Provider</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mobileBankingMethods.map((method) => (
                                <SelectItem key={method} value={method}>
                                  {method}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchedMobileMethod && (
                      <FormField
                        control={form.control}
                        name="mobileNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 01712345678"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? 'Submitting...'
                  : 'Submit Request'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
