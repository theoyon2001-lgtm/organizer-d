'use client';

import {
  ArrowLeft,
  Armchair,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { upcomingEvents } from '@/lib/data';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type SeatStatus = 'available' | 'selected' | 'booked' | 'unavailable';

type Seat = {
  id: string;
  status: SeatStatus;
  label: string;
};

type Section = {
  id: string;
  name: string;
  rows: number;
  cols: number;
  seats: Seat[];
  pricingTierId: string;
};

type PricingTier = {
  id: string;
  name: string;
  price: number;
  color: string;
};

const pricingTiersData: PricingTier[] = [
  { id: 'tier-1', name: 'VIP', price: 150.0, color: 'bg-purple-500' },
  { id: 'tier-2', name: 'General', price: 75.0, color: 'bg-blue-500' },
  { id: 'tier-3', name: 'Economy', price: 40.0, color: 'bg-green-500' },
];

export default function SeatLayoutEditorPage() {
  const params = useParams<{ eventId: string }>();
  const event = upcomingEvents.find((e) => e.id === params.eventId);
  const { toast } = useToast();

  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  if (!event) {
    notFound();
  }

  const activeSection = sections.find((s) => s.id === activeSectionId);

  const handleAddSection = () => {
    const newSectionId = `section-${sections.length + 1}`;
    setSections([
      ...sections,
      {
        id: newSectionId,
        name: `Section ${sections.length + 1}`,
        rows: 5,
        cols: 10,
        seats: Array.from({ length: 50 }, (_, i) => ({
          id: `${newSectionId}-seat-${i}`,
          status: 'available',
          label: `${i + 1}`,
        })),
        pricingTierId: pricingTiersData[0].id,
      },
    ]);
    setActiveSectionId(newSectionId);
  };

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(seatId)) {
        newSelected.delete(seatId);
      } else {
        newSelected.add(seatId);
      }
      return Array.from(newSelected);
    });
  };

  const updateSectionGrid = (sectionId: string, newRows: number, newCols: number) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        const totalSeats = newRows * newCols;
        return {
          ...s,
          rows: newRows,
          cols: newCols,
          seats: Array.from({ length: totalSeats }, (_, i) => ({
            id: `${s.id}-seat-${i}`,
            status: 'available',
            label: `${i + 1}`,
          })),
        };
      }
      return s;
    }));
    setSelectedSeats([]);
  };

  const handleAssignTier = (tierId: string) => {
    if (selectedSeats.length === 0 || !activeSectionId) return;

     setSections(sections.map(s => {
      if (s.id === activeSectionId) {
        // A better implementation would be to assign tier to seat
        // but for simplicity we assign it to section
        return { ...s, pricingTierId: tierId };
      }
      return s;
    }));

    toast({
        title: 'Pricing Tier Assigned',
        description: `${selectedSeats.length} seats in ${activeSection?.name} have been assigned to the ${pricingTiersData.find(t=>t.id === tierId)?.name} tier.`
    });

    setSelectedSeats([]);
  };
  
  const getSeatTierColor = (seatId: string) => {
    const section = sections.find(s => seatId.startsWith(s.id));
    if (section) {
        return pricingTiersData.find(t => t.id === section.pricingTierId)?.color.replace('bg-', 'text-');
    }
    return 'text-muted-foreground/50';
  }

  const handleSaveLayout = () => {
    toast({
      title: 'Layout Saved!',
      description: `The seat layout for "${event.name}" has been saved successfully.`,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/seats/layout-builder">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Seat Layout: {event.name}
          </h1>
          <p className="text-muted-foreground">
            Design and manage the seating arrangement for your event.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Layout Builder</CardTitle>
              <CardDescription>
                Click on a section below, then click seats to select them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full min-h-[400px] p-4 bg-muted/30 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-4">
                <div className="w-full h-12 bg-muted rounded-md flex items-center justify-center mb-8">
                  <p className="font-bold text-muted-foreground tracking-widest">STAGE</p>
                </div>
                {sections.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    <Armchair className="mx-auto h-12 w-12" />
                    <p className="mt-2 font-semibold">No sections yet</p>
                    <p className="text-sm">Click "Add Section" to get started.</p>
                  </div>
                ) : (
                  <div className="w-full space-y-8">
                    {sections.map(section => {
                      const tier = pricingTiersData.find(t => t.id === section.pricingTierId);
                      return (
                      <div key={section.id} onClick={() => { setActiveSectionId(section.id); setSelectedSeats([]); }} className={cn("p-4 border-2 rounded-lg cursor-pointer transition-colors", activeSectionId === section.id ? "border-primary bg-primary/5" : "border-transparent hover:border-border")}>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-lg">{section.name}</h3>
                          {tier && <Badge style={{backgroundColor: tier.color}} className="text-white">{tier.name}</Badge>}
                        </div>
                        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${section.cols}, minmax(0, 1fr))` }}>
                          {section.seats.map(seat => {
                             const isSelected = selectedSeats.includes(seat.id);
                             
                             let colorClass = getSeatTierColor(seat.id);
                             if(isSelected) {
                                colorClass = 'text-primary';
                             } else if (seat.status === 'booked') {
                                colorClass = 'text-destructive';
                             } else if (seat.status === 'unavailable') {
                                colorClass = 'text-muted-foreground/20';
                             }

                            return (
                              <button key={seat.id} onClick={(e) => { e.stopPropagation(); handleSeatClick(seat.id); }} className={cn("aspect-square flex items-center justify-center rounded-md transition-colors", isSelected && 'bg-primary/10')}>
                                <Armchair className={cn("h-5 w-5", colorClass)} />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )})}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Tools & Properties</CardTitle>
              <CardDescription>
                Manage sections and pricing tiers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Sections</h3>
                  <Button variant="outline" size="sm" onClick={handleAddSection}>
                    <Plus className="mr-2 h-4 w-4" /> Add Section
                  </Button>
                </div>
                {sections.length > 0 ? (
                    <div className="space-y-2">
                        {sections.map(section => (
                            <div key={section.id} onClick={() => {setActiveSectionId(section.id); setSelectedSeats([])}} className={cn("flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors", activeSectionId === section.id ? "bg-muted" : "hover:bg-muted/50")}>
                                <p className="font-medium">{section.name}</p>
                                <Button variant="ghost" size="icon" onClick={(e) => {e.stopPropagation(); setSections(sections.filter(s => s.id !== section.id)); setActiveSectionId(null); setSelectedSeats([])}}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2 text-sm text-muted-foreground p-4 bg-muted/30 rounded-md text-center">
                        No sections created yet.
                    </div>
                )}
              </div>
              {activeSection && (
                <>
                <Separator />
                <div className="space-y-4">
                    <h3 className="font-semibold">{activeSection.name} Properties</h3>
                    <div className="space-y-2">
                        <Label htmlFor="section-name">Section Name</Label>
                        <Input id="section-name" value={activeSection.name} onChange={e => setSections(sections.map(s => s.id === activeSectionId ? {...s, name: e.target.value} : s))} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Rows</Label>
                            <Input type="number" value={activeSection.rows} onChange={e => updateSectionGrid(activeSection.id, Math.max(1, parseInt(e.target.value) || 1), activeSection.cols)} min={1} />
                        </div>
                        <div className="space-y-2">
                            <Label>Seats per row</Label>
                            <Input type="number" value={activeSection.cols} onChange={e => updateSectionGrid(activeSection.id, activeSection.rows, Math.max(1, parseInt(e.target.value) || 1))} min={1} />
                        </div>
                     </div>
                </div>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle>Pricing Tiers</CardTitle>
                  <CardDescription>Assign a pricing tier to the selected seats in the active section.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center">
                    <span className="text-sm font-medium text-muted-foreground">Selected seats:</span>
                    <span className="ml-2 font-bold">{selectedSeats.length}</span>
                 </div>
                <Select onValueChange={handleAssignTier} disabled={selectedSeats.length === 0 || !activeSectionId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Assign a tier" />
                    </SelectTrigger>
                    <SelectContent>
                        {pricingTiersData.map(tier => (
                            <SelectItem key={tier.id} value={tier.id}>
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-3 h-3 rounded-full", tier.color)} />
                                    <span>{tier.name} (${tier.price})</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button onClick={handleSaveLayout}>Save Layout</Button>
        <Button variant="outline" type="button" asChild>
          <Link href="/seats/layout-builder">Cancel</Link>
        </Button>
      </div>
    </div>
  );
}
