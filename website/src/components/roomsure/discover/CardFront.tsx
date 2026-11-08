import { useState } from "react";
import { createPortal } from "react-dom";
import { Box } from "lucide-react";
import type { DeckCard } from "@/lib/roomsure/deck";
import type { Destination } from "@/lib/roomsure/types";
import { hasRoomTour } from "@/lib/roomsure/scans";
import { TourOverlay } from "@/components/roomsure/room/TourOverlay";
import { PhotoCarousel } from "./PhotoCarousel";
import { ReasonChips } from "./ReasonChips";
import { ScoreRing } from "./ScoreRing";
import { money, shortDate } from "./format";

export function CardFront({ card, destination, interactive }: { card: DeckCard; destination: Destination; interactive: boolean }) {
  const l = card.listing;
  const [tour, setTour] = useState(false);
  return (
    <>
    <div className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-soft">
      <div className="relative h-[58%] shrink-0">
        <PhotoCarousel photos={l.photos} alt={l.title} interactive={interactive} />
        {hasRoomTour(l.scanUrl) && (
          <button
            type="button"
            tabIndex={interactive ? 0 : -1}
            aria-label={`Open the 3D tour of ${l.title}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); if (interactive) setTour(true); }}
            className="absolute left-3 top-7 inline-flex cursor-pointer items-center gap-1 rounded-full bg-surface/95 px-2.5 py-1 text-[13px] font-semibold text-foreground shadow-soft transition hover:bg-surface"
          >
            <Box className="size-3.5 text-primary" /> 3D tour
          </button>
        )}
        <div className="absolute right-3 top-7">
          <ScoreRing score={card.score} rank={card.rank} />
        </div>
        <div className="photo-fade pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-3 pt-16 text-primary-foreground">
          <h2 className="text-[22px] font-bold leading-tight">{l.title}</h2>
          <p className="tabular mt-1 text-[14px] font-medium opacity-95">
            {l.neighborhood} · <span className="font-bold">{money(l.pricePerMonth)}/mo</span> · {l.commuteMinutes} min to {destination}
          </p>
          <p className="tabular text-[13px] opacity-90">
            Free {shortDate(l.availableFrom)} – {shortDate(l.availableTo)}
          </p>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        <p className="text-[15px] leading-snug text-foreground">{card.sentence}</p>
        <ReasonChips card={card} />
      </div>
    </div>
    {tour && typeof document !== "undefined" && createPortal(
      // Portal events bubble through the React tree into the swipe card's
      // flip/drag handlers, so cut them off at the overlay boundary.
      <div onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
        <TourOverlay open onClose={() => setTour(false)} scanUrl={l.scanUrl} title={l.title} />
      </div>,
      document.body,
    )}
    </>
  );
}
