"use client";

import React, { useState } from "react";
import { Search, Settings, User } from "lucide-react"; // Simplified icon imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Navbar({ className }: { className?: string }) {
  const [showSearch, setShowSearch] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form.elements.namedItem('search') as HTMLInputElement;
    
    toast({
      title: "Recherche",
      description: `Vous avez recherché "${searchInput.value}"`,
      variant: "default",
    });
    
    searchInput.value = "";
    setShowSearch(false);
  };

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container flex h-14 items-center">
        <div className="flex flex-col">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl"> aMordineroX</span>
          </Link>
          <p className="text-sm text-muted-foreground hidden md:block">
            
          </p>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {showSearch ? (
            <form onSubmit={handleSearch} className="relative">
              <Input
                name="search"
                placeholder="Rechercher..."
                className="w-48 h-8 text-sm bg-blue-900/20 border-blue-900/30 pr-8"
                autoFocus
                onBlur={() => setShowSearch(false)}
              />
              <Button 
                type="submit"
                variant="ghost" 
                size="icon"
                className="absolute right-0 top-0 h-8 w-8 text-blue-300"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-300"
              onClick={() => setShowSearch(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-300"
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-300 rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#16213e] border-blue-900/30">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-blue-900/20" />
              <DropdownMenuItem className="cursor-pointer text-blue-300 focus:text-blue-100 focus:bg-blue-900/30">
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-blue-300 focus:text-blue-100 focus:bg-blue-900/30">
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-blue-300 focus:text-blue-100 focus:bg-blue-900/30">
                API Keys
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-blue-900/20" />
              <DropdownMenuItem className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-900/20">
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
