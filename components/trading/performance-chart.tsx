"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ChevronUp, ChevronDown } from "lucide-react";

export function PerformanceChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Générer des données simulées pour le graphique
  const generateData = () => {
    const data = [];
    let value = 50000;
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 30);
    
    for(let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Simuler une variation aléatoire avec une tendance haussière
      value = value * (1 + (Math.random() * 0.04 - 0.015));
      
      data.push({
        date,
        value,
      });
    }
    
    return data;
  };
  
  const data = generateData();
  const startValue = data[0].value;
  const endValue = data[data.length - 1].value;
  const changePercent = ((endValue - startValue) / startValue) * 100;
  const isPositive = changePercent >= 0;
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Configurer le canvas pour qu'il utilise la bonne taille de pixel
    const devicePixelRatio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Trouver les valeurs min et max pour le scaling
    const values = data.map(d => d.value);
    const min = Math.min(...values) * 0.95;
    const max = Math.max(...values) * 1.05;
    
    // Fonction pour convertir une valeur en coordonnée y
    const scaleY = (value: number) => {
      return rect.height - ((value - min) / (max - min)) * rect.height;
    };
    
    const scaleX = rect.width / (data.length - 1);
    
    // Dessiner le graphique en dégradé
    ctx.lineWidth = 2;
    ctx.strokeStyle = isPositive ? '#06b6d4' : '#f43f5e';
    
    // Dessiner la ligne
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = i * scaleX;
      const y = scaleY(d.value);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Ajouter le remplissage avec dégradé
    const gradient = ctx.createLinearGradient(0, 0, 0, rect.height);
    if (isPositive) {
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
    } else {
      gradient.addColorStop(0, 'rgba(244, 63, 94, 0.3)');
      gradient.addColorStop(1, 'rgba(244, 63, 94, 0.0)');
    }
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.lineTo(0, scaleY(data[0].value));
    data.forEach((d, i) => {
      const x = i * scaleX;
      const y = scaleY(d.value);
      ctx.lineTo(x, y);
    });
    ctx.lineTo((data.length - 1) * scaleX, rect.height);
    ctx.lineTo(0, rect.height);
    ctx.closePath();
    ctx.fill();
    
    // Ajouter des points à certains intervalles
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = isPositive ? '#06b6d4' : '#f43f5e';
    
    for (let i = 0; i < data.length; i += 6) {
      const x = i * scaleX;
      const y = scaleY(data[i].value);
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }, [data, isPositive]);
  
  return (
    <Card className="card-glow bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <CardHeader className="border-b border-blue-900/20 pb-2">
        <CardTitle className="text-blue-100 flex items-center justify-between text-base">
          <div className="flex items-center">
            <ArrowUpRight className="mr-2 h-5 w-5 text-blue-400" />
            Performance
          </div>
          <div className="flex items-center">
            <span className={`flex items-center font-medium ${isPositive ? 'text-cyan-400' : 'text-rose-500'}`}>
              {isPositive ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {Math.abs(changePercent).toFixed(2)}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-[3/1] w-full">
          <canvas 
            ref={canvasRef}
            className="w-full h-full"
            style={{ height: "100%", width: "100%" }}
          />
          
          <div className="absolute bottom-2 left-4">
            <span className="text-xs text-blue-400/70">30 jours</span>
          </div>
          
          <div className="absolute bottom-2 right-4">
            <span className={`text-xs font-mono ${isPositive ? 'text-cyan-400' : 'text-rose-500'}`}>
              {isPositive ? '+' : '-'}${Math.abs(endValue - startValue).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
