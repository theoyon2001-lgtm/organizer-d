'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const formSchema = z.object({
  eventName: z.string().min(2, 'Event name must be at least 2 characters.'),
  eventDate: z.date({
    required_error: 'An event date is required.',
  }),
  eventVenue: z.string().min(2, 'Event venue must be at least 2 characters.'),
  eventDescription: z
    .string()
    .min(10, 'Description must be at least 10 characters.'),
  ticketTypes: z.array(
    z.object({
      name: z.string().min(2, 'Ticket type name must be at least 2 characters.'),
      price: z.coerce.number().positive('Price must be a positive number.'),
      quantity: z.coerce.number().int().positive('Quantity must be a positive integer.'),
    })
  ).min(1, "You must add at least one ticket type."),
  category: z.string({ required_error: 'Please select a category.' }),
  eventImage: z.string().url('Please provide a valid image URL.'),
});

export default function CreateEventPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: '',
      eventVenue: '',
      eventDescription: '',
      ticketTypes: [{ name: 'General Admission', price: 25, quantity: 100 }],
      eventImage: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "ticketTypes",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Event Created!',
      description: 'Your new event has been successfully created.',
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Event</h1>
        <p className="text-muted-foreground">
          Fill out the details below to create a new event.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                  <CardDescription>
                    Provide the main details for your event.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="eventName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Summer Music Festival" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your event..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Ticketing</CardTitle>
                  <CardDescription>
                    Add different ticket types for your event.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    <div>
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-1 gap-4 rounded-lg border p-4 mb-4 md:grid-cols-7">
                                <FormField
                                    control={form.control}
                                    name={`ticketTypes.${index}.name`}
                                    render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Type Name</FormLabel>
                                        <FormControl>
                                        <Input {...field} placeholder="e.g. VIP" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`ticketTypes.${index}.price`}
                                    render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Price ($)</FormLabel>
                                        <FormControl>
                                        <Input {...field} type="number" placeholder="e.g. 50" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`ticketTypes.${index}.quantity`}
                                    render={({ field }) => (
                                    <FormItem className="md:col-span-1">
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                        <Input {...field} type="number" placeholder="e.g. 100" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <div className="flex items-end md:col-span-1">
                                    <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => append({ name: '', price: 0, quantity: 0 })}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Ticket Type
                        </Button>
                        <FormField
                            control={form.control}
                            name="ticketTypes"
                            render={() => (
                                <FormItem>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Event Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="eventImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"
                            {...field}
                          />
                        </FormControl>
                        {field.value && (
                          <div className="mt-4 aspect-video w-full overflow-hidden rounded-md">
                            <Image
                              src={field.value}
                              alt="Event image preview"
                              width={400}
                              height={225}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date & Time</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().toDateString())
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventVenue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue</FormLabel>
                        <FormControl>
                          <Input placeholder="Central Park, New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="music">Music</SelectItem>
                            <SelectItem value="conference">Conference</SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="festival">Festival</SelectItem>
                            <SelectItem value="charity">Charity</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Button type="submit" className="w-full">
                Create Event
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
