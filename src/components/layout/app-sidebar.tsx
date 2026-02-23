'use client';

import { usePathname } from 'next/navigation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
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
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import React from 'react';

const navItems: (
  | {
      href: string;
      icon: React.ElementType;
      label: string;
      subItems?: undefined;
    }
  | {
      href: string;
      icon: React.ElementType;
      label: string;
      subItems: { href: string; label: string }[];
    }
)[] = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  {
    href: '/events',
    icon: Calendar,
    label: 'Events',
    subItems: [
      { href: '/events/create', label: 'Create Event' },
      { href: '/events/edit', label: 'Edit Event' },
      { href: '/events/clone', label: 'Clone Event' },
      { href: '/events/drafts', label: 'Draft Events' },
    ],
  },
  {
    href: '/seats',
    icon: Armchair,
    label: 'Seat Management',
    subItems: [
      { href: '/seats/layout-builder', label: 'Seat Layout Builder' },
      { href: '/seats/ticket-categories', label: 'Ticket Categories' },
      { href: '/seats/pricing-setup', label: 'Pricing Setup' },
      { href: '/seats/seat-availability', label: 'Seat Availability' },
    ],
  },
  {
    href: '/orders',
    icon: ShoppingCart,
    label: 'Orders',
    subItems: [
      { href: '/orders/all', label: 'All Orders' },
      { href: '/orders/refund-requests', label: 'Refund Requests' },
      { href: '/orders/attendee-list', label: 'Attendee List' },
      { href: '/orders/export-csv', label: 'Export CSV' },
    ],
  },
  {
    href: '/earnings',
    icon: DollarSign,
    label: 'Earnings',
    subItems: [
      { href: '/earnings/overview', label: 'Earnings Overview' },
      { href: '/earnings/commission-breakdown', label: 'Commission Breakdown' },
      { href: '/earnings/withdrawal-request', label: 'Withdrawal Request' },
    ],
  },
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
          {navItems.map((item) =>
            item.subItems ? (
              <Collapsible key={item.href} asChild>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.href)}
                      tooltip={{ children: item.label, side: 'right' }}
                      className="group w-full"
                    >
                      <item.icon />
                      <span>{item.label}</span>
                      <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === subItem.href}
                          >
                            <Link href={subItem.href}>{subItem.label}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
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
            )
          )}
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
