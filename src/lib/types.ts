export type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  ticketsSold: number;
  totalTickets: number;
  imageUrl?: string;
  price?: number;
};

export type Sale = {
  month: string;
  sales: number;
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type Order = {
  id: string;
  customerName: string;
  eventName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Refunded' | 'Pending';
};
