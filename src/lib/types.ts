export type Event = {
  name: string;
  date: string;
  location: string;
  ticketsSold: number;
  totalTickets: number;
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
