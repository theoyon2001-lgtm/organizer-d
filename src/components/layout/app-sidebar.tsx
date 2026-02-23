'use client';

import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Calendar,
  Armchair,
  ShoppingCart,
  DollarSign,
  TicketPercent,
  BarChart3,
  Settings,
  Ticket,
} from 'lucide-react';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/events', icon: Calendar, label: 'Events' },
  { href: '/seats', icon: Armchair, label: 'Seat Management' },
  { href: '/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/earnings', icon: DollarSign, label: 'Earnings' },
  { href: '/promotions', icon: TicketPercent, label: 'Promotions' },
  { href: '/reports', icon: BarChart3, label: 'Reports' },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-10 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Ticket className="size-6" />
          </Button>
          <h1 className="text-xl font-semibold text-sidebar-foreground">
            Kicket
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-1" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith('/settings')}
              tooltip={{ children: 'Settings', side: 'right' }}
            >
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
