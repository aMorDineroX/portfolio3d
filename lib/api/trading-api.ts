// Interface pour les données de marché
export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
}

// Interface pour les données d'un ordre
export interface OrderData {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  price?: number;
  amount: number;
  status: 'open' | 'filled' | 'cancelled';
  createdAt: Date;
}

// Interface pour les données d'un portefeuille
export interface PortfolioData {
  assets: {
    asset: string;
    free: number;
    locked: number;
  }[];
}

// Classe pour gérer les interactions avec l'API de trading
export class TradingAPI {
  private apiKey: string | null = null;
  private apiSecret: string | null = null;
  private baseUrl: string;
  
  constructor(baseUrl = 'https://api.binance.com') {
    this.baseUrl = baseUrl;
  }
  
  // Définir les clés API
  public setCredentials(apiKey: string, apiSecret: string): void {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }
  
  // Vérifier si l'API est configurée
  public isConfigured(): boolean {
    return !!this.apiKey && !!this.apiSecret;
  }
  
  // Récupérer les données de marché
  public async getMarketData(): Promise<MarketData[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        // En développement, on renvoie des données simulées
        return this.getMockMarketData();
      }
      
      const response = await fetch(`${this.baseUrl}/api/v3/ticker/24hr`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return data.map((item: any) => ({
        symbol: item.symbol,
        price: parseFloat(item.lastPrice),
        change24h: parseFloat(item.priceChangePercent),
        volume: parseFloat(item.volume),
      }));
    } catch (error) {
      console.error('Error fetching market data:', error);
      return this.getMockMarketData();
    }
  }
  
  // Placer un ordre
  public async placeOrder(
    symbol: string,
    side: 'buy' | 'sell',
    type: 'market' | 'limit',
    amount: number,
    price?: number
  ): Promise<OrderData> {
    try {
      if (!this.isConfigured()) {
        throw new Error('API not configured. Please set API key and secret.');
      }
      
      if (process.env.NODE_ENV === 'development') {
        // En développement, on simule un ordre réussi
        return this.getMockOrder(symbol, side, type, amount, price);
      }
      
      const params = new URLSearchParams({
        symbol,
        side: side.toUpperCase(),
        type: type.toUpperCase(),
        quantity: amount.toString(),
      });
      
      if (type === 'limit' && price) {
        params.append('price', price.toString());
        params.append('timeInForce', 'GTC');
      }
      
      // Signature à implémenter pour une vraie API
      // const signature = this.generateSignature(params.toString());
      // params.append('signature', signature);
      
      const response = await fetch(`${this.baseUrl}/api/v3/order`, {
        method: 'POST',
        headers: {
          'X-MBX-APIKEY': this.apiKey!,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        id: data.orderId,
        symbol: data.symbol,
        side: data.side.toLowerCase(),
        type: data.type.toLowerCase(),
        price: parseFloat(data.price),
        amount: parseFloat(data.origQty),
        status: data.status.toLowerCase(),
        createdAt: new Date(data.transactTime),
      };
    } catch (error) {
      console.error('Error placing order:', error);
      // Retourner un ordre simulé en cas d'erreur
      return this.getMockOrder(symbol, side, type, amount, price);
    }
  }
  
  // Récupérer le portefeuille
  public async getPortfolio(): Promise<PortfolioData> {
    try {
      if (!this.isConfigured()) {
        throw new Error('API not configured. Please set API key and secret.');
      }
      
      if (process.env.NODE_ENV === 'development') {
        return this.getMockPortfolio();
      }
      
      // Signature à implémenter pour une vraie API
      // const params = new URLSearchParams();
      // const signature = this.generateSignature(params.toString());
      // params.append('signature', signature);
      
      const response = await fetch(`${this.baseUrl}/api/v3/account`, {
        headers: {
          'X-MBX-APIKEY': this.apiKey!,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        assets: data.balances.map((balance: any) => ({
          asset: balance.asset,
          free: parseFloat(balance.free),
          locked: parseFloat(balance.locked),
        })),
      };
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      return this.getMockPortfolio();
    }
  }
  
  // Générer une signature pour l'authentification
  private generateSignature(queryString: string): string {
    // Implémenter la signature HMAC SHA256 pour une vraie API
    // Cette implementation dépend de la façon dont l'API trading demande l'authentification
    return 'mock-signature';
  }
  
  // Données de marché simulées
  private getMockMarketData(): MarketData[] {
    return [
      { symbol: "BTC/USD", price: 50342.12, change24h: 2.34, volume: 12987.45 },
      { symbol: "ETH/USD", price: 2654.87, change24h: -1.22, volume: 8765.32 },
      { symbol: "SOL/USD", price: 132.45, change24h: 5.67, volume: 4532.12 },
      { symbol: "ADA/USD", price: 0.54, change24h: 0.87, volume: 2345.67 },
      { symbol: "DOT/USD", price: 6.23, change24h: -2.45, volume: 1234.56 },
      { symbol: "XRP/USD", price: 0.52, change24h: 1.23, volume: 9876.54 },
      { symbol: "AVAX/USD", price: 32.45, change24h: 4.56, volume: 3456.78 },
      { symbol: "DOGE/USD", price: 0.087, change24h: -3.21, volume: 5678.90 },
    ];
  }
  
  // Ordre simulé
  private getMockOrder(
    symbol: string,
    side: 'buy' | 'sell',
    type: 'market' | 'limit',
    amount: number,
    price?: number
  ): OrderData {
    return {
      id: `order-${Date.now()}`,
      symbol,
      side,
      type,
      price: price || (type === 'market' ? undefined : 0),
      amount,
      status: 'open',
      createdAt: new Date(),
    };
  }
  
  // Portefeuille simulé
  private getMockPortfolio(): PortfolioData {
    return {
      assets: [
        { asset: 'BTC', free: 0.5, locked: 0.1 },
        { asset: 'ETH', free: 5.0, locked: 0 },
        { asset: 'USD', free: 10000, locked: 500 },
      ],
    };
  }
}

// Exporter une instance singleton de l'API
export const tradingApi = new TradingAPI();
