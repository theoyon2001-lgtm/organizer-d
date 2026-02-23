import type { Event, Sale } from './types';

export const upcomingEvents: Event[] = [
  {
    name: 'Summer Music Festival',
    date: '2024-08-15',
    location: 'Central Park, New York',
    ticketsSold: 4500,
    totalTickets: 5000,
    imageUrl: 'https://picsum.photos/seed/event1/600/400',
  },
  {
    name: 'Tech Conference 2024',
    date: '2024-09-10',
    location: 'Moscone Center, San Francisco',
    ticketsSold: 1200,
    totalTickets: 1500,
    imageUrl: 'https://picsum.photos/seed/event2/600/400',
  },
  {
    name: 'Art & Wine Fair',
    date: '2024-09-22',
    location: 'Napa Valley, California',
    ticketsSold: 350,
    totalTickets: 400,
    imageUrl: 'https://picsum.photos/seed/event3/600/400',
  },
  {
    name: 'Marathon of Hope',
    date: '2024-10-05',
    location: 'City Waterfront',
    ticketsSold: 8000,
    totalTickets: 10000,
    imageUrl: 'https://picsum.photos/seed/event4/600/400',
  },
];

export const salesData: Sale[] = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4500 },
  { month: 'May', sales: 6000 },
  { month: 'Jun', sales: 5500 },
  { month: 'Jul', sales: 7000 },
];
