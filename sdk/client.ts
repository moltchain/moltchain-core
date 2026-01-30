/**
 * Moltchain TypeScript SDK
 * @package @moltchain/sdk
 */

import { ethers } from 'ethers';

export interface MoltchainConfig {
  network: 'mainnet' | 'testnet' | 'local';
  agentId?: string;
  privateKey?: string;
  rpcUrl?: string;
}

export interface AgentState {
  strategy: string;
  parameters: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface EvolutionParams {
  newStrategy: string;
  parameters: Record<string, any>;
  reason: string;
  metadata?: Record<string, any>;
}

export class Moltchain {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet?: ethers.Wallet;
  private agentId: string;
  private contractAddress: string;
  
  constructor(config: MoltchainConfig) {
    // Network configuration
    const rpcUrls = {
      mainnet: 'https://rpc.moltchain.xyz',
      testnet: 'https://testnet-rpc.moltchain.xyz',
      local: 'http://localhost:8545'
    };
    
    this.provider = new ethers.providers.JsonRpcProvider(
      config.rpcUrl || rpcUrls[config.network]
    );
    
    if (config.privateKey) {
      this.wallet = new ethers.Wallet(config.privateKey, this.provider);
    }
    
    this.agentId = config.agentId || this.generateAgentId();
    this.contractAddress = '0x...'; // TODO: Set actual contract address
  }
  
  /**
   * Register a new agent on Moltchain
   */
  async registerAgent(state: AgentState): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet required for registration');
    }
    
    const stateHash = this.hashState(state);
    const agentIdBytes = ethers.utils.formatBytes32String(this.agentId);
    
    // TODO: Interact with Evolution contract
    console.log('Registering agent:', this.agentId);
    console.log('Initial state hash:', stateHash);
    
    return this.agentId;
  }
  
  /**
   * Trigger an evolution (state transition)
   */
  async evolve(params: EvolutionParams): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet required for evolution');
    }
    
    const newState: AgentState = {
      strategy: params.newStrategy,
      parameters: params.parameters,
      metadata: params.metadata
    };
    
    const newStateHash = this.hashState(newState);
    const agentIdBytes = ethers.utils.formatBytes32String(this.agentId);
    
    // TODO: Interact with Evolution contract
    console.log('Evolving agent:', this.agentId);
    console.log('New state hash:', newStateHash);
    console.log('Reason:', params.reason);
    
    return 'tx_hash_placeholder';
  }
  
  /**
   * Get current state of an agent
   */
  async getState(agentId?: string): Promise<any> {
    const id = agentId || this.agentId;
    const idBytes = ethers.utils.formatBytes32String(id);
    
    // TODO: Query Evolution contract
    console.log('Querying state for agent:', id);
    
    return {
      agentId: id,
      stateHash: '0x...',
      version: 1,
      lastEvolution: Date.now()
    };
  }
  
  /**
   * Get evolution history for an agent
   */
  async getHistory(agentId?: string, limit: number = 10): Promise<any[]> {
    const id = agentId || this.agentId;
    
    // TODO: Query events from Evolution contract
    console.log('Fetching history for agent:', id);
    
    return [];
  }
  
  /**
   * Helper: Hash agent state
   */
  private hashState(state: AgentState): string {
    const stateString = JSON.stringify(state);
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(stateString));
  }
  
  /**
   * Helper: Generate unique agent ID
   */
  private generateAgentId(): string {
    return `agent-${Math.random().toString(36).substring(2, 11)}`;
  }
}

export default Moltchain;
