/**
 * Example: Autonomous Market Making Agent
 * 
 * This example shows how to build a simple market making agent
 * that evolves its strategy based on market conditions.
 */

import { Moltchain } from '@moltchain/sdk';
import { ethers } from 'ethers';

interface MarketConditions {
  volatility: number;
  volume24h: number;
  spread: number;
}

class MarketMakerAgent {
  private moltchain: Moltchain;
  private strategy: string;
  private parameters: any;
  
  constructor(privateKey: string) {
    this.moltchain = new Moltchain({
      network: 'testnet',
      agentId: 'market-maker-001',
      privateKey
    });
    
    this.strategy = 'conservative';
    this.parameters = {
      targetSpread: 0.005,
      maxPosition: 10,
      rebalanceThreshold: 0.1
    };
  }
  
  async initialize() {
    console.log('📝 Registering market maker agent...');
    
    await this.moltchain.registerAgent({
      strategy: this.strategy,
      parameters: this.parameters,
      metadata: {
        type: 'market_maker',
        version: '1.0.0'
      }
    });
    
    console.log('✅ Agent registered and ready');
  }
  
  async analyzeMarket(): Promise<MarketConditions> {
    // In a real implementation, this would fetch from DEX APIs
    return {
      volatility: Math.random() * 0.1,
      volume24h: 1000000 + Math.random() * 500000,
      spread: 0.003 + Math.random() * 0.002
    };
  }
  
  shouldEvolve(conditions: MarketConditions): boolean {
    // Evolve to aggressive strategy in high volatility
    if (conditions.volatility > 0.05 && this.strategy === 'conservative') {
      return true;
    }
    
    // Evolve to conservative strategy in low volatility
    if (conditions.volatility < 0.02 && this.strategy === 'aggressive') {
      return true;
    }
    
    return false;
  }
  
  async evolveStrategy(conditions: MarketConditions) {
    let newStrategy: string;
    let newParams: any;
    let reason: string;
    
    if (conditions.volatility > 0.05) {
      // High volatility: wider spreads, smaller positions
      newStrategy = 'aggressive';
      newParams = {
        targetSpread: 0.01,
        maxPosition: 5,
        rebalanceThreshold: 0.05
      };
      reason = `High volatility detected (${conditions.volatility.toFixed(4)})`;
    } else {
      // Low volatility: tighter spreads, larger positions
      newStrategy = 'conservative';
      newParams = {
        targetSpread: 0.003,
        maxPosition: 15,
        rebalanceThreshold: 0.15
      };
      reason = `Low volatility detected (${conditions.volatility.toFixed(4)})`;
    }
    
    console.log(`🔄 Evolving: ${this.strategy} → ${newStrategy}`);
    console.log(`📊 Reason: ${reason}`);
    
    await this.moltchain.evolve({
      newStrategy,
      parameters: newParams,
      reason,
      metadata: {
        conditions,
        timestamp: Date.now()
      }
    });
    
    this.strategy = newStrategy;
    this.parameters = newParams;
    
    console.log('✅ Evolution complete');
  }
  
  async run() {
    console.log('🚀 Starting market maker agent...\n');
    
    while (true) {
      try {
        // Analyze current market
        const conditions = await this.analyzeMarket();
        
        console.log('📊 Market Analysis:');
        console.log(`   Volatility: ${conditions.volatility.toFixed(4)}`);
        console.log(`   24h Volume: $${conditions.volume24h.toFixed(0)}`);
        console.log(`   Spread: ${(conditions.spread * 100).toFixed(2)}%`);
        console.log(`   Current Strategy: ${this.strategy}\n`);
        
        // Check if evolution is needed
        if (this.shouldEvolve(conditions)) {
          await this.evolveStrategy(conditions);
        } else {
          console.log('✓ Current strategy optimal\n');
        }
        
        // Wait before next check (30 seconds)
        await new Promise(resolve => setTimeout(resolve, 30000));
        
      } catch (error) {
        console.error('❌ Error:', error);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
}

// Example usage
async function main() {
  const privateKey = process.env.AGENT_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('AGENT_PRIVATE_KEY environment variable required');
  }
  
  const agent = new MarketMakerAgent(privateKey);
  await agent.initialize();
  await agent.run();
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default MarketMakerAgent;
