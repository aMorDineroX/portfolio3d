"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { tradingApi } from "@/lib/api/trading-api";
import { useToast } from "@/components/ui/use-toast";
import { Dices, TrendingUp } from "lucide-react";

interface TradingFormProps {
  asset: string;
}

export function TradingForm({ asset }: TradingFormProps) {
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<number>(0.1);
  const [price, setPrice] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Vérifier si l'API est configurée
      if (!tradingApi.isConfigured()) {
        // Utilisation de simulations en développement
        toast({
          title: "Mode démo",
          description: "Utilisation de données simulées. En production, connectez-vous à une API réelle.",
          variant: "default",
        });
      }
      
      // Extraire le symbole correct
      const formattedSymbol = asset.replace("/", "");
      
      // Placer l'ordre via l'API
      const order = await tradingApi.placeOrder(
        formattedSymbol,
        orderSide,
        orderType,
        amount,
        orderType === "limit" && price !== "" ? price : undefined
      );
      
      // Afficher la confirmation
      toast({
        title: "Ordre placé avec succès",
        description: `${orderSide.toUpperCase()} ${amount} ${asset.split('/')[0]} à ${orderType === "market" ? "prix du marché" : price} ${asset.split('/')[1]}`,
        variant: "success",
      });
      
      // Réinitialiser le formulaire
      if (orderType === "limit") {
        setPrice("");
      }
    } catch (error) {
      console.error("Erreur lors du placement de l'ordre:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du placement de l'ordre. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RadioGroup
        defaultValue={orderSide}
        onValueChange={(value) => setOrderSide(value as "buy" | "sell")}
        className="grid grid-cols-2 gap-2"
      >
        <div className="bg-blue-900/10 rounded-lg p-3 border border-blue-900/20 transition-all duration-200 hover:bg-blue-900/20">
          <RadioGroupItem value="buy" id="buy" className="peer sr-only" />
          <Label 
            htmlFor="buy" 
            className="flex flex-col items-center justify-center cursor-pointer peer-data-[state=checked]:text-green-400 text-green-500/70 peer-data-[state=checked]:font-bold"
          >
            <TrendingUp size={20} className="mb-1" />
            ACHETER
          </Label>
        </div>
        <div className="bg-blue-900/10 rounded-lg p-3 border border-blue-900/20 transition-all duration-200 hover:bg-blue-900/20">
          <RadioGroupItem value="sell" id="sell" className="peer sr-only" />
          <Label 
            htmlFor="sell" 
            className="flex flex-col items-center justify-center cursor-pointer peer-data-[state=checked]:text-red-400 text-red-500/70 peer-data-[state=checked]:font-bold"
          >
            <TrendingUp size={20} className="mb-1 rotate-180" />
            VENDRE
          </Label>
        </div>
      </RadioGroup>
      
      <div className="space-y-2">
        <Label htmlFor="orderType" className="text-blue-300">Type d'ordre</Label>
        <Select 
          defaultValue={orderType}
          onValueChange={(value) => setOrderType(value as "market" | "limit")}
        >
          <SelectTrigger id="orderType" className="bg-blue-900/10 border-blue-900/30">
            <SelectValue placeholder="Type d'ordre" />
          </SelectTrigger>
          <SelectContent className="bg-[#16213e] border-blue-900/30">
            <SelectItem value="market">Marché</SelectItem>
            <SelectItem value="limit">Limite</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {orderType === "limit" && (
        <div className="space-y-2">
          <Label htmlFor="price" className="text-blue-300">Prix ({asset.split('/')[1]})</Label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-blue-300/50 sm:text-sm">$</span>
            </div>
            <Input
              id="price"
              type="number"
              placeholder="Entrez le prix"
              value={price}
              onChange={(e) => setPrice(e.target.valueAsNumber)}
              className="pl-7 bg-blue-900/10 border-blue-900/30"
            />
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="amount" className="text-blue-300">Quantité ({asset.split('/')[0]})</Label>
          <span className="text-blue-100 font-mono bg-blue-900/30 px-2 py-0.5 rounded text-sm">{amount}</span>
        </div>
        <Slider
          id="amount"
          defaultValue={[0.1]}
          max={1}
          step={0.01}
          onValueChange={(value) => setAmount(value[0])}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-blue-300/70">
          <span>0</span>
          <span>0.5</span>
          <span>1</span>
        </div>
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button 
          type="button"
          variant="outline"
          size="icon"
          className="border-blue-900/30 bg-blue-900/10 hover:bg-blue-900/30 text-blue-300"
          onClick={() => setAmount(Math.random())}
        >
          <Dices size={16} />
        </Button>
        
        <Button 
          type="submit" 
          className={`w-full ${
            orderSide === "buy" 
              ? "buy-button text-white" 
              : "sell-button text-white"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Traitement..." : `${orderSide === "buy" ? "Acheter" : "Vendre"} ${asset.split('/')[0]}`}
        </Button>
      </div>
    </form>
  );
}
