import { format, subDays } from 'date-fns';
import type {
  Event,
  Sale,
  Revenue,
  Payout,
  Commission,
  CommissionChartData,
  DailySale,
  TicketTypeSale,
  TicketPurchase,
} from './types';

// Add a seeded random generator to ensure consistent data between server and client
const createSeededRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
};

export const upcomingEvents: Event[] = [
  {
    id: 'winter-wonderfest',
    name: 'Winter Wonderfest',
    date: '2024-01-20',
    location: 'Millennium Park, Chicago',
    ticketsSold: 2500,
    totalTickets: 3000,
    imageUrl: 'https://picsum.photos/seed/event5/600/400',
    price: 45,
  },
  {
    id: 'spring-bloom-festival',
    name: 'Spring Bloom Festival',
    date: '2024-04-05',
    location: 'Brooklyn Botanic Garden, New York',
    ticketsSold: 1800,
    totalTickets: 2000,
    imageUrl: 'https://picsum.photos/seed/event6/600/400',
    price: 60,
  },
  {
    id: 'indie-film-showcase',
    name: 'Indie Film Showcase',
    date: '2024-06-12',
    location: 'TCL Chinese Theatre, Hollywood',
    ticketsSold: 450,
    totalTickets: 500,
    imageUrl: 'https://picsum.photos/seed/event7/600/400',
    price: 25,
  },
  {
    id: 'summer-music-festival',
    name: 'Summer Music Festival',
    date: '2024-08-15',
    location: 'Central Park, New York',
    ticketsSold: 4500,
    totalTickets: 5000,
    imageUrl: 'https://picsum.photos/seed/event1/600/400',
    price: 75,
  },
  {
    id: 'tech-conference-2024',
    name: 'Tech Conference 2024',
    date: '2024-09-10',
    location: 'Moscone Center, San Francisco',
    ticketsSold: 1200,
    totalTickets: 1500,
    imageUrl: 'https://picsum.photos/seed/event2/600/400',
    price: 499,
  },
  {
    id: 'art-wine-fair',
    name: 'Art & Wine Fair',
    date: '2024-09-22',
    location: 'Napa Valley, California',
    ticketsSold: 350,
    totalTickets: 400,
    imageUrl: 'https://picsum.photos/seed/event3/600/400',
    price: 120,
  },
  {
    id: 'marathon-of-hope',
    name: 'Marathon of Hope',
    date: '2024-10-05',
    location: 'City Waterfront',
    ticketsSold: 8000,
    totalTickets: 10000,
    imageUrl: 'https://picsum.photos/seed/event4/600/400',
    price: 50,
  },
  {
    id: 'oktoberfest-celebration',
    name: 'Oktoberfest Celebration',
    date: '2024-10-15',
    location: 'Old World Village, Huntington Beach',
    ticketsSold: 3000,
    totalTickets: 3500,
    imageUrl: 'https://picsum.photos/seed/event8/600/400',
    price: 30,
  },
];

export const draftEvents: Event[] = [
  {
    id: 'untitled-charity-run',
    name: 'Untitled Charity Run',
    date: '2024-11-15',
    location: 'Venue TBD',
    ticketsSold: 0,
    totalTickets: 500,
    imageUrl: 'https://picsum.photos/seed/draft1/600/400',
  },
  {
    id: 'annual-tech-summit',
    name: 'Annual Tech Summit',
    date: '2024-12-01',
    location: 'Convention Center',
    ticketsSold: 0,
    totalTickets: 1000,
    imageUrl: 'https://picsum.photos/seed/draft2/600/400',
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

export const revenueData: Revenue[] = [
  { month: 'Jan', revenue: 6500 },
  { month: 'Feb', revenue: 5900 },
  { month: 'Mar', revenue: 8000 },
  { month: 'Apr', revenue: 8100 },
  { month: 'May', revenue: 5600 },
  { month: 'Jun', revenue: 7200 },
  { month: 'Jul', revenue: 7850 },
  { month: 'Aug', revenue: 6800 },
  { month: 'Sep', revenue: 9000 },
  { month: 'Oct', revenue: 9500 },
  { month: 'Nov', revenue: 7300 },
  { month: 'Dec', revenue: 10200 },
];

export const payoutHistory: Payout[] = [
  {
    id: 'payout-1',
    date: '2024-07-01',
    amount: 5200.0,
    method: 'Bank Transfer',
    status: 'Completed',
  },
  {
    id: 'payout-2',
    date: '2024-06-15',
    amount: 4800.0,
    method: 'PayPal',
    status: 'Completed',
  },
  {
    id: 'payout-3',
    date: '2024-06-01',
    amount: 7500.5,
    method: 'Bank Transfer',
    status: 'Completed',
  },
  {
    id: 'payout-4',
    date: '2024-05-15',
    amount: 3200.0,
    method: 'Bank Transfer',
    status: 'Completed',
  },
  {
    id: 'payout-5',
    date: '2024-05-01',
    amount: 6100.25,
    method: 'PayPal',
    status: 'Completed',
  },
  {
    id: 'payout-6',
    date: '2024-04-15',
    amount: 2500.0,
    method: 'Bank Transfer',
    status: 'Failed',
  },
];

export const commissionHistory: Commission[] = [
  { orderId: 'ORD5894', eventName: 'Summer Music Festival', date: '2024-07-10', grossSale: 150, commission: 15, netEarning: 135 },
  { orderId: 'ORD5895', eventName: 'Tech Conference 2024', date: '2024-07-11', grossSale: 499, commission: 49.9, netEarning: 449.1 },
  { orderId: 'ORD5896', eventName: 'Summer Music Festival', date: '2024-07-11', grossSale: 75, commission: 7.5, netEarning: 67.5 },
  { orderId: 'ORD5897', eventName: 'Art & Wine Fair', date: '2024-07-12', grossSale: 240, commission: 24, netEarning: 216 },
  { orderId: 'ORD5898', eventName: 'Tech Conference 2024', date: '2024-07-13', grossSale: 998, commission: 99.8, netEarning: 898.2 },
  { orderId: 'ORD5899', eventName: 'Indie Film Showcase', date: '2024-07-14', grossSale: 50, commission: 5, netEarning: 45 },
  { orderId: 'ORD5900', eventName: 'Summer Music Festival', date: '2024-07-15', grossSale: 225, commission: 22.5, netEarning: 202.5 },
];

export const commissionChartData: CommissionChartData[] = [
  { month: 'Jan', revenue: 6500, commission: 650 },
  { month: 'Feb', revenue: 5900, commission: 590 },
  { month: 'Mar', revenue: 8000, commission: 800 },
  { month: 'Apr', revenue: 8100, commission: 810 },
  { month: 'May', revenue: 5600, commission: 560 },
  { month: 'Jun', revenue: 7200, commission: 720 },
  { month: 'Jul', revenue: 7850, commission: 785 },
];

export const dailySales: DailySale[] = Array.from({ length: 90 }, (_, i) => {
  // Use a seed that is consistent for each item in the array
  const seed1 = (i + 1) * 100;
  const seed2 = (i + 1) * 200;
  const random1 = createSeededRandom(seed1);
  const random2 = createSeededRandom(seed2);

  // Use a fixed date to avoid hydration errors from new Date()
  const date = subDays(new Date('2024-07-23'), i);
  const ticketsSold = Math.floor(random1() * 80) + 20;
  const revenue = ticketsSold * (random2() * 40 + 15);
  return {
    date: format(date, 'yyyy-MM-dd'),
    ticketsSold: ticketsSold,
    revenue: parseFloat(revenue.toFixed(2)),
  };
}).reverse();

export const ticketTypeSalesData: TicketTypeSale[] = [
  { event: 'Summer Music Festival', ticketType: 'General Admission', ticketsSold: 3500, price: 75, revenue: 262500 },
  { event: 'Summer Music Festival', ticketType: 'VIP', ticketsSold: 1000, price: 150, revenue: 150000 },
  { event: 'Tech Conference 2024', ticketType: 'Standard Pass', ticketsSold: 900, price: 499, revenue: 449100 },
  { event: 'Tech Conference 2024', ticketType: 'Workshop Add-on', ticketsSold: 300, price: 199, revenue: 59700 },
  { event: 'Art & Wine Fair', ticketType: 'Tasting Ticket', ticketsSold: 250, price: 120, revenue: 30000 },
  { event: 'Art & Wine Fair', ticketType: 'Non-Drinker', ticketsSold: 100, price: 40, revenue: 4000 },
  { event: 'Winter Wonderfest', ticketType: 'Adult', ticketsSold: 2000, price: 45, revenue: 90000 },
  { event: 'Winter Wonderfest', ticketType: 'Child', ticketsSold: 500, price: 25, revenue: 12500 },
  { event: 'Spring Bloom Festival', ticketType: 'Any-Day Pass', ticketsSold: 1800, price: 60, revenue: 108000 },
  { event: 'Indie Film Showcase', ticketType: 'Single Screening', ticketsSold: 300, price: 25, revenue: 7500 },
  { event: 'Indie Film Showcase', ticketType: 'All-Day Pass', ticketsSold: 150, price: 70, revenue: 10500 },
  { event: 'Marathon of Hope', ticketType: 'Runner Registration', ticketsSold: 8000, price: 50, revenue: 400000 },
  { event: 'Oktoberfest Celebration', ticketType: 'Beer Stein Package', ticketsSold: 2500, price: 30, revenue: 75000 },
  { event: 'Oktoberfest Celebration', ticketType: 'General Entry', ticketsSold: 500, price: 15, revenue: 7500 },
];

export const ticketPurchases: TicketPurchase[] = [
  { purchaseId: 'tp-001', customerName: 'Alice Johnson', customerEmail: 'alice@example.com', event: 'Summer Music Festival', ticketType: 'General Admission', purchaseDate: '2024-07-01' },
  { purchaseId: 'tp-002', customerName: 'Bob Williams', customerEmail: 'bob@example.com', event: 'Summer Music Festival', ticketType: 'General Admission', purchaseDate: '2024-07-02' },
  { purchaseId: 'tp-003', customerName: 'Charlie Brown', customerEmail: 'charlie@example.com', event: 'Summer Music Festival', ticketType: 'VIP', purchaseDate: '2024-07-03' },
  { purchaseId: 'tp-004', customerName: 'Diana Prince', customerEmail: 'diana@example.com', event: 'Tech Conference 2024', ticketType: 'Standard Pass', purchaseDate: '2024-07-04' },
  { purchaseId: 'tp-005', customerName: 'Ethan Hunt', customerEmail: 'ethan@example.com', event: 'Tech Conference 2024', ticketType: 'Standard Pass', purchaseDate: '2024-07-05' },
  { purchaseId: 'tp-006', customerName: 'Fiona Glenanne', customerEmail: 'fiona@example.com', event: 'Tech Conference 2024', ticketType: 'Workshop Add-on', purchaseDate: '2024-07-05' },
  { purchaseId: 'tp-007', customerName: 'George Costanza', customerEmail: 'george@example.com', event: 'Art & Wine Fair', ticketType: 'Tasting Ticket', purchaseDate: '2024-07-06' },
  { purchaseId: 'tp-008', customerName: 'Hannah Montana', customerEmail: 'hannah@example.com', event: 'Winter Wonderfest', ticketType: 'Adult', purchaseDate: '2024-01-10' },
  { purchaseId: 'tp-009', customerName: 'Indiana Jones', customerEmail: 'indy@example.com', event: 'Spring Bloom Festival', ticketType: 'Any-Day Pass', purchaseDate: '2024-03-20' },
  { purchaseId: 'tp-010', customerName: 'Jack Sparrow', customerEmail: 'jack@example.com', event: 'Indie Film Showcase', ticketType: 'All-Day Pass', purchaseDate: '2024-06-01' },
  { purchaseId: 'tp-011', customerName: 'Kevin McCallister', customerEmail: 'kevin@example.com', event: 'Oktoberfest Celebration', ticketType: 'Beer Stein Package', purchaseDate: '2024-10-05' },
];
