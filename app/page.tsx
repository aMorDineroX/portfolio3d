import { TradingDashboard } from "@/components/trading/trading-dashboard";
import { PortfolioPanel } from "@/components/trading/portfolio-panel";
import { PerformanceChart } from "@/components/trading/performance-chart";
import { PriceAlert } from "@/components/trading/price-alert";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
            Plateforme de Trading 3D
          </h1>
          <p className="text-blue-300/70 mb-8">
            Visualisez et tradez vos actifs avec une perspective tridimensionnelle
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <TradingDashboard />
            </div>
            <div className="space-y-6">
              <PortfolioPanel />
              <PerformanceChart />
              <PriceAlert />
            </div>
          </div>
          
          <footer className="mt-12 text-center text-blue-300/50 text-sm">
            <p>
              Plateforme développée avec Next.js, Three.js, TypeScript, Tailwind CSS et Shadcn UI
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
