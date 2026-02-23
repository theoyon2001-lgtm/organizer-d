'use client';

import React from 'react';
import { Payout } from '@/lib/types';
import { Ticket } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface InvoiceProps {
  payout: Payout;
}

const Invoice = React.forwardRef<HTMLDivElement, InvoiceProps>(({ payout }, ref) => {
  return (
    <div ref={ref} className="p-10 font-sans text-gray-800 bg-white">
      <header className="flex justify-between items-start pb-8 border-b">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center size-12 bg-primary text-primary-foreground rounded-lg p-2">
              <Ticket className="size-8" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Kicket</h1>
          </div>
          <address className="text-sm text-gray-500 not-italic">
            123 Event Horizon, Suite 100<br />
            New York, NY 10001, USA<br />
            support@kicket.com
          </address>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold uppercase text-gray-400">Receipt</h2>
          <p className="text-sm text-gray-500 mt-2">
            ID: <span className="font-medium text-gray-700">{payout.id}</span>
          </p>
          <p className="text-sm text-gray-500">
            Date: <span className="font-medium text-gray-700">{new Date(payout.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </p>
        </div>
      </header>

      <main className="mt-10">
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="font-semibold text-gray-500 mb-2 uppercase text-xs tracking-wider">Payout To</h3>
            <p className="font-medium text-gray-800">Organizer Account</p>
            <p className="text-sm text-gray-600">Associated with your Kicket profile</p>
          </div>
          <div className="text-right">
            <h3 className="font-semibold text-gray-500 mb-2 uppercase text-xs tracking-wider">Payout Method</h3>
            <p className="font-medium text-gray-800">{payout.method}</p>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
              <th className="p-4 font-semibold">Description</th>
              <th className="p-4 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="p-4">Payout for event earnings balance</td>
              <td className="p-4 text-right">${payout.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
        
        <div className="flex justify-end mt-8">
          <div className="w-full max-w-sm">
            <div className="flex justify-between text-gray-600 py-2">
              <span>Subtotal</span>
              <span>${payout.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-gray-600 py-2">
              <span>Processing Fees</span>
              <span>$0.00</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg text-gray-900 py-2">
              <span>Total Payout</span>
              <span>${payout.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 pt-8 border-t text-center text-sm text-gray-500">
        <p>Thank you for being a part of the Kicket community!</p>
        <p>If you have any questions, please contact support at <a href="mailto:support@kicket.com" className="text-primary hover:underline">support@kicket.com</a>.</p>
      </footer>
    </div>
  );
});
Invoice.displayName = 'Invoice';

export default Invoice;
