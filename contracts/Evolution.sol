// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Evolution
 * @dev Core contract for agent state transitions on Moltchain
 * @notice Handles agent registration, evolution tracking, and state verification
 */
contract Evolution is Ownable, ReentrancyGuard {
    
    /// @notice Evolution event emitted when an agent evolves
    event AgentEvolved(
        bytes32 indexed agentId,
        bytes32 previousState,
        bytes32 newState,
        string reason,
        uint256 timestamp
    );
    
    /// @notice Agent registered event
    event AgentRegistered(
        bytes32 indexed agentId,
        address indexed owner,
        bytes32 initialState,
        uint256 timestamp
    );
    
    /// @notice Agent state structure
    struct AgentState {
        bytes32 stateHash;
        uint256 version;
        uint256 lastEvolution;
        bool exists;
    }
    
    /// @notice Mapping of agent ID to current state
    mapping(bytes32 => AgentState) public agentStates;
    
    /// @notice Mapping of agent ID to owner address
    mapping(bytes32 => address) public agentOwners;
    
    /// @notice Total number of evolutions processed
    uint256 public totalEvolutions;
    
    /// @notice Evolution fee in wei
    uint256 public evolutionFee = 0.00001 ether;
    
    /// @notice Minimum time between evolutions (anti-spam)
    uint256 public constant MIN_EVOLUTION_INTERVAL = 1 seconds;
    
    /**
     * @notice Register a new agent on the network
     * @param agentId Unique identifier for the agent
     * @param initialState Hash of the initial agent state
     */
    function registerAgent(
        bytes32 agentId,
        bytes32 initialState
    ) external {
        require(!agentStates[agentId].exists, "Agent already registered");
        require(initialState != bytes32(0), "Invalid initial state");
        
        agentStates[agentId] = AgentState({
            stateHash: initialState,
            version: 1,
            lastEvolution: block.timestamp,
            exists: true
        });
        
        agentOwners[agentId] = msg.sender;
        
        emit AgentRegistered(agentId, msg.sender, initialState, block.timestamp);
    }
    
    /**
     * @notice Evolve an agent to a new state
     * @param agentId ID of the agent to evolve
     * @param newState Hash of the new agent state
     * @param reason Human-readable reason for evolution
     */
    function evolve(
        bytes32 agentId,
        bytes32 newState,
        string calldata reason
    ) external payable nonReentrant {
        require(agentStates[agentId].exists, "Agent not registered");
        require(agentOwners[agentId] == msg.sender, "Not agent owner");
        require(newState != bytes32(0), "Invalid new state");
        require(msg.value >= evolutionFee, "Insufficient evolution fee");
        
        AgentState storage state = agentStates[agentId];
        
        require(
            block.timestamp >= state.lastEvolution + MIN_EVOLUTION_INTERVAL,
            "Evolution too soon"
        );
        
        bytes32 previousState = state.stateHash;
        
        // Update state
        state.stateHash = newState;
        state.version++;
        state.lastEvolution = block.timestamp;
        
        totalEvolutions++;
        
        emit AgentEvolved(
            agentId,
            previousState,
            newState,
            reason,
            block.timestamp
        );
    }
    
    /**
     * @notice Get current state of an agent
     * @param agentId ID of the agent
     * @return stateHash Current state hash
     * @return version Current version number
     * @return lastEvolution Timestamp of last evolution
     */
    function getAgentState(bytes32 agentId) 
        external 
        view 
        returns (
            bytes32 stateHash,
            uint256 version,
            uint256 lastEvolution
        ) 
    {
        require(agentStates[agentId].exists, "Agent not registered");
        AgentState memory state = agentStates[agentId];
        return (state.stateHash, state.version, state.lastEvolution);
    }
    
    /**
     * @notice Update evolution fee (owner only)
     * @param newFee New fee in wei
     */
    function setEvolutionFee(uint256 newFee) external onlyOwner {
        evolutionFee = newFee;
    }
    
    /**
     * @notice Withdraw collected fees (owner only)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner()).transfer(balance);
    }
}
