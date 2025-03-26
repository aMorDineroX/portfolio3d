"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandlestickChart } from "./candlestick-chart";
import { TradingForm } from "./trading-form";
import { MarketData } from "./market-data";

export function TradingDashboard() {
  const [selectedAsset, setSelectedAsset] = useState("BTC/USD");
  
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="h-full card-glow bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
          <CardHeader className="border-b border-blue-900/20">
            <CardTitle className="text-blue-100 flex items-center">
              <span className="mr-2 h-3 w-3 rounded-full bg-blue-400 animate-pulse"></span>
              Graphique {selectedAsset}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[600px] p-2 sm:p-6" style={{ minHeight: '500px' }}>
            <Tabs defaultValue="3d" className="h-full flex flex-col">
              <TabsList className="bg-blue-900/20 p-1 self-start">
                <TabsTrigger value="3d" className="data-[state=active]:bg-blue-800/30">Vue 3D</TabsTrigger>
                <TabsTrigger value="2d" className="data-[state=active]:bg-blue-800/30">Vue 2D</TabsTrigger>
              </TabsList>
              <TabsContent value="3d" className="flex-1 mt-2">
                <CandlestickChart asset={selectedAsset} view="3d" />
              </TabsContent>
              <TabsContent value="2d" className="flex-1 mt-2">
                <CandlestickChart asset={selectedAsset} view="2d" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        <Card className="card-glow bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
          <CardHeader className="border-b border-blue-900/20">
            <CardTitle className="text-blue-100">Marché</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <MarketData onSelectAsset={setSelectedAsset} />
          </CardContent>
        </Card>
        <Card className="card-glow bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
          <CardHeader className="border-b border-blue-900/20">
            <CardTitle className="text-blue-100">Passer un ordre</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <TradingForm asset={selectedAsset} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
