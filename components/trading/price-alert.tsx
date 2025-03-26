"use client";

import { useState } from "react";
import { Bell, Plus, X, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface Alert {
  id: string;
  asset: string;
  condition: "above" | "below";
  price: number;
  active: boolean;
}

export function PriceAlert() {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: "1", asset: "BTC/USD", condition: "above", price: 55000, active: true },
    { id: "2", asset: "ETH/USD", condition: "below", price: 2000, active: true },
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newAsset, setNewAsset] = useState("BTC/USD");
  const [newCondition, setNewCondition] = useState<"above" | "below">("above");
  const [newPrice, setNewPrice] = useState<number | "">("");
  
  const { toast } = useToast();
  
  const handleToggleAlert = (id: string) => {
    setAlerts(currentAlerts => 
      currentAlerts.map(alert => 
        alert.id === id 
          ? { ...alert, active: !alert.active } 
          : alert
      )
    );
  };
  
  const handleDeleteAlert = (id: string) => {
    setAlerts(currentAlerts => currentAlerts.filter(alert => alert.id !== id));
    toast({
      title: "Alerte supprimée",
      description: "L'alerte de prix a été supprimée avec succès.",
      variant: "default",
    });
  };
  
  const handleAddAlert = () => {
    if (newPrice === "") {
      toast({
        title: "Prix requis",
        description: "Veuillez spécifier un prix pour l'alerte.",
        variant: "destructive",
      });
      return;
    }
    
    const newAlert: Alert = {
      id: Date.now().toString(),
      asset: newAsset,
      condition: newCondition,
      price: typeof newPrice === "number" ? newPrice : parseFloat(newPrice.toString()),
      active: true,
    };
    
    setAlerts(currentAlerts => [...currentAlerts, newAlert]);
    setIsAdding(false);
    setNewPrice("");
    
    toast({
      title: "Alerte créée",
      description: `Vous serez notifié quand ${newAsset} passe ${newCondition === "above" ? "au-dessus" : "en-dessous"} de ${newPrice}$.`,
      variant: "success",
    });
  };
  
  return (
    <Card className="card-glow bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <CardHeader className="border-b border-blue-900/20">
        <CardTitle className="text-blue-100 flex items-center justify-between text-base">
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-blue-400" />
            Alertes de prix
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-blue-300 hover:text-blue-100 hover:bg-blue-900/30"
            onClick={() => setIsAdding(!isAdding)}
          >
            {isAdding ? <X size={16} /> : <Plus size={16} />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {isAdding && (
          <div className="space-y-3 bg-blue-900/20 p-3 rounded-md border border-blue-900/30">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Select 
                  value={newAsset} 
                  onValueChange={setNewAsset}
                >
                  <SelectTrigger className="h-8 text-sm bg-blue-900/30 border-blue-900/30">
                    <SelectValue placeholder="Actif" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#16213e] border-blue-900/30">
                    <SelectItem value="BTC/USD">BTC/USD</SelectItem>
                    <SelectItem value="ETH/USD">ETH/USD</SelectItem>
                    <SelectItem value="SOL/USD">SOL/USD</SelectItem>
                    <SelectItem value="ADA/USD">ADA/USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select 
                  value={newCondition} 
                  onValueChange={(value) => setNewCondition(value as "above" | "below")}
                >
                  <SelectTrigger className="h-8 text-sm bg-blue-900/30 border-blue-900/30">
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#16213e] border-blue-900/30">
                    <SelectItem value="above">Au-dessus</SelectItem>
                    <SelectItem value="below">En-dessous</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-blue-300/50 text-sm">$</span>
              </div>
              <Input 
                type="number"
                placeholder="Prix"
                className="pl-7 h-8 text-sm bg-blue-900/30 border-blue-900/30"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.valueAsNumber)}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-1">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                className="h-7 text-sm text-blue-300"
                onClick={() => setIsAdding(false)}
              >
                Annuler
              </Button>
              <Button 
                type="button"
                size="sm" 
                className="h-7 text-sm bg-blue-600 hover:bg-blue-700"
                onClick={handleAddAlert}
              >
                Ajouter
              </Button>
            </div>
          </div>
        )}
        
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-blue-300/70">
            <Info className="h-8 w-8 mb-2 text-blue-300/50" />
            <p className="text-sm">Aucune alerte configurée</p>
            <p className="text-xs mt-1">Cliquez sur + pour ajouter une alerte de prix</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className="flex items-center justify-between p-2 rounded-md bg-blue-900/10 border border-blue-900/20"
              >
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Badge className="mr-1 bg-blue-500/20 text-blue-200 hover:bg-blue-500/30">
                      {alert.asset}
                    </Badge>
                    <span className="text-sm text-blue-100">
                      {alert.condition === "above" ? ">" : "<"} ${alert.price.toLocaleString('fr-FR')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={alert.active} 
                    onCheckedChange={() => handleToggleAlert(alert.id)}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-blue-300/70 hover:text-blue-100 hover:bg-blue-900/30"
                    onClick={() => handleDeleteAlert(alert.id)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
