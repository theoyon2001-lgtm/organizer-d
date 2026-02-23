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

export type Payout = {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'Completed' | 'Pending' | 'Failed';
};

export type Commission = {
  orderId: string;
  eventName: string;
  date: string;
  grossSale: number;
  commission: number;
  netEarning: number;
};

export type CommissionChartData = {
  month: string;
  revenue: number;
  commission: number;
};

export type DailySale = {
  date: string;
  ticketsSold: number;
  revenue: number;
};

export type TicketTypeSale = {
  event: string;
  ticketType: string;
  ticketsSold: number;
  price: number;
  revenue: number;
};
