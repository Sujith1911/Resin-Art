"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { MapPin, Navigation, X, Check, Loader2 } from "lucide-react";

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: {
    address_line: string;
    city: string;
    state: string;
    pincode: string;
    lat?: number;
    lng?: number;
  }) => void;
}

export function LocationPickerModal({ isOpen, onClose, onSelectAddress }: LocationPickerModalProps) {
  const [locating, setLocating] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [detectedAddress, setDetectedAddress] = useState<{
    address_line: string;
    city: string;
    state: string;
    pincode: string;
  } | null>(null);

  if (!isOpen) return null;

  // Reverse geocode via OpenStreetMap Nominatim (100% Free API, No Credit Card!)
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const street = addr.road || addr.suburb || addr.neighbourhood || data.display_name.split(",")[0] || "";
        const city = addr.city || addr.town || addr.district || addr.county || "Bengaluru";
        const state = addr.state || "Karnataka";
        const pincode = addr.postcode || "560001";

        setDetectedAddress({
          address_line: street,
          city,
          state,
          pincode,
        });
      }
    } catch (e) {
      console.error("Reverse geocoding error:", e);
    }
  };

  // Auto Detect GPS Location
  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        await reverseGeocode(lat, lng);
        setLocating(false);
      },
      (err) => {
        alert(`Location Error: ${err.message}`);
        setLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Search address by name via Nominatim
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await res.json();
      if (data && data[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setCoords({ lat, lng });
        await reverseGeocode(lat, lng);
      } else {
        alert("Location not found. Try entering your city or area name.");
      }
    } catch (e) {
      console.error("Geocoding search error:", e);
    } finally {
      setSearching(false);
    }
  };

  const handleConfirm = () => {
    if (detectedAddress) {
      onSelectAddress({
        ...detectedAddress,
        lat: coords?.lat,
        lng: coords?.lng,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <GlassCard glow="gold" className="p-6 max-w-lg w-full space-y-5">
        <div className="flex items-center justify-between border-b border-border/20 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif font-bold text-lg">Pinpoint Delivery Address (OpenStreetMap)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-rose-500/10">
            <X className="w-5 h-5 text-rose-500" />
          </button>
        </div>

        {/* GPS Auto-Detect Button */}
        <Button variant="gold" size="lg" onClick={handleAutoLocate} disabled={locating} className="w-full text-sm shadow-gold-glow">
          {locating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Navigation className="w-4 h-4 mr-2" />}
          {locating ? "Detecting GPS Coordinates..." : "Use Current GPS Location"}
        </Button>

        <div className="relative flex items-center gap-2">
          <div className="h-px bg-border/40 flex-1" />
          <span className="text-xs text-muted-foreground font-bold uppercase">or search area</span>
          <div className="h-px bg-border/40 flex-1" />
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter locality, landmark, or area (e.g. Indiranagar Bengaluru)"
            className="flex-1 bg-background border rounded-xl px-3.5 py-2.5 text-sm"
          />
          <Button variant="outline" size="lg" type="submit" disabled={searching} className="text-sm">
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </Button>
        </form>

        {/* Map Preview iframe */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-amber-400/30 bg-black/20">
          {coords ? (
            <iframe
              title="OpenStreetMap Picker"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.01}%2C${coords.lat - 0.01}%2C${coords.lng + 0.01}%2C${coords.lat + 0.01}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs text-center p-4">
              Click "Use Current GPS Location" or search your locality to pinpoint your address on the map.
            </div>
          )}
        </div>

        {/* Address Fields Autofilled */}
        {detectedAddress && (
          <div className="space-y-2 text-sm bg-amber-500/5 p-4 rounded-xl border border-amber-400/20">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block">Autofilled Address Details:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">Street:</span> <p className="font-bold">{detectedAddress.address_line}</p></div>
              <div><span className="text-muted-foreground">City:</span> <p className="font-bold">{detectedAddress.city}</p></div>
              <div><span className="text-muted-foreground">State:</span> <p className="font-bold">{detectedAddress.state}</p></div>
              <div><span className="text-muted-foreground">Pincode:</span> <p className="font-bold">{detectedAddress.pincode}</p></div>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="outline" size="lg" onClick={onClose} className="text-sm">Cancel</Button>
          <Button variant="gold" size="lg" onClick={handleConfirm} disabled={!detectedAddress} className="text-sm shadow-gold-glow">
            <Check className="w-4 h-4 mr-1" /> Use Selected Address
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
