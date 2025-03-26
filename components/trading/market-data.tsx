"use client";

import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { tradingApi } from "@/lib/api/trading-api";
import { Search } from "lucide-react";

interface MarketDataProps {
  onSelectAsset: (asset: string) => void;
}

interface AssetData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
}

export function MarketData({ onSelectAsset }: MarketDataProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [marketData, setMarketData] = useState<AssetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await tradingApi.getMarketData();
        
        // Convertir les symboles comme "BTCUSDT" en format plus lisible "BTC/USD"
        const formattedData = data.map(item => {
          // Extraire la paire d'échange et la formatter
          const symbol = item.symbol;
          let formattedSymbol = symbol;
          
          if (symbol.endsWith('USDT')) {
            formattedSymbol = `${symbol.slice(0, -4)}/USD`;
          } else if (symbol.endsWith('USD')) {
            formattedSymbol = `${symbol.slice(0, -3)}/USD`;
          } else if (symbol.endsWith('BTC')) {
            formattedSymbol = `${symbol.slice(0, -3)}/BTC`;
          } else if (symbol.endsWith('ETH')) {
            formattedSymbol = `${symbol.slice(0, -3)}/ETH`;
          }
          
          return {
            ...item,
            symbol: formattedSymbol
          };
        });
        
        setMarketData(formattedData);
      } catch (error) {
        console.error("Erreur lors du chargement des données de marché:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Mettre à jour les données toutes les 10 secondes
    const intervalId = setInterval(() => {
      fetchData();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const filteredData = marketData.filter(asset => 
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-blue-300/50" />
        </div>
        <Input
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-blue-900/10 border-blue-900/30 focus:border-blue-500/50 focus:ring-blue-500/30"
        />
      </div>
      
      <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-900/50 scrollbar-track-transparent">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <Table className="market-table">
            <TableHeader>
              <TableRow className="border-b-0">
                <TableHead className="rounded-tl-md">Paire</TableHead>
                <TableHead className="text-right">Prix</TableHead>
                <TableHead className="text-right rounded-tr-md">24h</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((asset) => (
                  <TableRow 
                    key={asset.symbol}
                    className="cursor-pointer border-blue-900/20 transition-colors"
                    onClick={() => onSelectAsset(asset.symbol)}
                  >
                    <TableCell className="font-medium text-blue-100">{asset.symbol}</TableCell>
                    <TableCell className="text-right font-mono">
                      <span className="text-blue-100">${asset.price.toFixed(2)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={asset.change24h >= 0 ? "success" : "destructive"} className="shadow-glow">
                        {asset.change24h >= 0 ? "+" : ""}{asset.change24h.toFixed(2)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-blue-300/70">
                    Aucune paire trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
