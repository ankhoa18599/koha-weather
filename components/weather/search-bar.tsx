"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Mic } from "lucide-react";
import debounce from "lodash/debounce";
import { LocationData } from "../../lib/types/weather";
import { searchLocations } from "../../lib/api/weather";
import { Input } from "@components/common/ui/input";
import { Button } from "@components/common/ui/button";
import { Card } from "@components/common/ui/card";

interface SearchBarProps {
  onLocationSelect: (location: LocationData) => void;
}

export function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const locations = await searchLocations(searchQuery);
        setSuggestions(locations);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    }, 300),
    [],
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleLocationSelect = (location: LocationData) => {
    onLocationSelect(location);
    setQuery(`${location.name}, ${location.country}`);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleVoiceSearch = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search location..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            className="border-4 border-black pr-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            onFocus={() => setShowSuggestions(true)}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowSuggestions(true)}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button
          size="icon"
          variant="outline"
          className={`border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            isListening ? "bg-red-100" : ""
          }`}
          onClick={handleVoiceSearch}
        >
          <Mic className="h-4 w-4" />
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute z-50 mt-2 w-full border-4 border-black p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {suggestions.map((location, index) => (
            <button
              key={index}
              className="w-full rounded-lg p-2 text-left hover:bg-accent"
              onClick={() => handleLocationSelect(location)}
            >
              {location.name}, {location.country}
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}
