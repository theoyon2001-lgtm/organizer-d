'use client';

import { Pie, PieChart, Tooltip, Cell, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { TicketTypeSale } from '@/lib/types';

const chartConfig = {
  revenue: {
    label: 'Revenue',
  },
};

interface SalesByTypeChartProps {
  data: (Omit<TicketTypeSale, 'event' | 'ticketsSold' | 'price'> & { fill: string })[];
}

export default function SalesByTypeChart({ data }: SalesByTypeChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <PieChart>
        <Tooltip
          cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
          content={<ChartTooltipContent nameKey="ticketType" hideLabel />}
        />
        <Pie
          data={data}
          dataKey="revenue"
          nameKey="ticketType"
          cx="50%"
          cy="50%"
          outerRadius={100}
          labelLine={false}
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
          }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
            if (percent < 0.05) return null; // Don't render label for small slices
            return (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-xs font-bold"
              >
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Legend
          wrapperStyle={{ fontSize: '0.875rem' }}
          iconSize={10}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
      </PieChart>
    </ChartContainer>
  );
}
