"use client";

import { useEffect, useState } from "react";
import { tradingApi } from "@/lib/api/trading-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, Clock, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AssetAllocation {
  asset: string;
  percentage: number;
  value: number;
  color: string;
}

export function PortfolioPanel() {
  const [assets, setAssets] = useState<{asset: string; free: number; locked: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [allocation, setAllocation] = useState<AssetAllocation[]>([]);

  // Palettes de couleurs pour les assets
  const colorPalette = [
    "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500", 
    "bg-pink-500", "bg-indigo-500", "bg-red-500", "bg-orange-500"
  ];
  
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        const portfolio = await tradingApi.getPortfolio();
        
        // Filtrer les actifs avec un solde > 0
        const nonEmptyAssets = portfolio.assets.filter(a => a.free > 0 || a.locked > 0);
        setAssets(nonEmptyAssets);
        
        // Calculer la valeur totale (ici on simule avec des prix fixes)
        const assetPrices: {[key: string]: number} = {
          'BTC': 50000,
          'ETH': 2500,
          'USD': 1,
          'USDT': 1,
          'SOL': 130,
          'ADA': 0.5,
        };
        
        let total = 0;
        const alloc: AssetAllocation[] = [];
        
        nonEmptyAssets.forEach((asset, index) => {
          const price = assetPrices[asset.asset] || 1;
          const value = (asset.free + asset.locked) * price;
          total += value;
          
          alloc.push({
            asset: asset.asset,
            value: value,
            percentage: 0, // On calcule après avoir le total
            color: colorPalette[index % colorPalette.length]
          });
        });
        
        // Calculer les pourcentages
        alloc.forEach(item => {
          item.percentage = (item.value / total) * 100;
        });
        
        // Trier par valeur décroissante
        alloc.sort((a, b) => b.value - a.value);
        
        setTotalValue(total);
        setAllocation(alloc);
      } catch (error) {
        console.error("Erreur lors du chargement du portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPortfolio();
    
    // Rafraîchir toutes les 30 secondes
    const intervalId = setInterval(fetchPortfolio, 30000);
    return () => clearInterval(intervalId);
  }, []);
  
  // Simule quelques transactions récentes
  const recentTransactions = [
    { id: 'tx1', asset: 'BTC', type: 'buy', amount: 0.05, price: 49876.32, time: '08:45' },
    { id: 'tx2', asset: 'ETH', type: 'sell', amount: 1.2, price: 2578.91, time: 'Hier' },
    { id: 'tx3', asset: 'SOL', type: 'buy', amount: 10, price: 128.76, time: 'Hier' },
  ];
  
  return (
    <Card className="card-glow bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <CardHeader className="border-b border-blue-900/20">
        <CardTitle className="text-blue-100 flex items-center">
          <Wallet className="mr-2 h-5 w-5 text-blue-400" />
          Portfolio
          <Badge className="ml-auto bg-blue-500/30 text-blue-100 hover:bg-blue-500/40">
            ${totalValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="assets" className="w-full">
          <TabsList className="w-full bg-blue-900/20 p-1">
            <TabsTrigger value="assets" className="w-1/2 data-[state=active]:bg-blue-800/30">
              <BarChart3 className="h-4 w-4 mr-2" />
              Actifs
            </TabsTrigger>
            <TabsTrigger value="history" className="w-1/2 data-[state=active]:bg-blue-800/30">
              <Clock className="h-4 w-4 mr-2" />
              Historique
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assets" className="space-y-4 mt-4">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {allocation.map((item) => (
                    <div key={item.asset} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-blue-100">{item.asset}</span>
                        <span className="text-blue-200">${item.value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress className="h-2" value={item.percentage} max={100} />
                        <span className="text-xs text-blue-300/70 min-w-[3rem] text-right">
                          {item.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4">
                  <h4 className="text-sm font-semibold text-blue-100 mb-2">Détails</h4>
                  <div className="bg-blue-900/10 rounded-md p-3 space-y-2">
                    {assets.map((asset) => (
                      <div key={asset.asset} className="flex justify-between text-sm">
                        <span className="text-blue-200">{asset.asset}</span>
                        <span className="text-blue-100 font-mono">
                          {asset.free.toLocaleString('fr-FR', { maximumFractionDigits: 8 })}
                          {asset.locked > 0 && (
                            <span className="text-blue-300/70 text-xs ml-1">
                              ({asset.locked.toLocaleString('fr-FR', { maximumFractionDigits: 8 })} bloqués)
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-blue-100">Transactions récentes</h4>
              <div className="bg-blue-900/10 rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-blue-300/70">Actif</TableHead>
                      <TableHead className="text-blue-300/70">Type</TableHead>
                      <TableHead className="text-blue-300/70 text-right">Montant</TableHead>
                      <TableHead className="text-blue-300/70 text-right">Temps</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((tx) => (
                      <TableRow key={tx.id} className="border-blue-900/20">
                        <TableCell className="font-medium">{tx.asset}</TableCell>
                        <TableCell>
                          <Badge variant={tx.type === 'buy' ? 'success' : 'destructive'} className="text-xs">
                            {tx.type === 'buy' ? 'Achat' : 'Vente'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {tx.amount.toLocaleString('fr-FR', { maximumFractionDigits: 8 })}
                        </TableCell>
                        <TableCell className="text-right text-blue-300/70">
                          {tx.time}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
