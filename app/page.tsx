import { TradingDashboard } from "@/components/trading/trading-dashboard";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
          Plateforme de Trading 3D
        </h1>
        <p className="text-blue-300/70 mb-8">
          Visualisez et tradez vos actifs avec une perspective tridimensionnelle
        </p>
        <TradingDashboard />
        
        <footer className="mt-12 text-center text-blue-300/50 text-sm">
          <p>
            Plateforme développée avec Next.js, Three.js, TypeScript, Tailwind CSS et Shadcn UI
          </p>
        </footer>
      </div>
    </main>
  );
}
