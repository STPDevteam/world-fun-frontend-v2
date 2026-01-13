'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { Graph,NodeEvent } from '@antv/g6';
import { Box } from '@chakra-ui/react';
import { useTokensSearch, useAgents } from '@/hooks';

interface NetworkGraphProps {
  onClickProject?: (project: any) => void;
}


const  worlds = [
  {
    id:'tradeclash',
    size: 24,
    world:'TRADECLASH',
    targetFundRaise: 60000,
    totalAweRaised: '60000000000000000000000',
    fundType: 'USDC',
    status: 'LIVE',
    link: 'https://www.world.fun/tradeclash',
    tokenName:'Trade Clash',
    description:'Trade Clash offers a dynamic simulation of the global economy, where twelve AI-controlled Country Agents interact through trade, production, and strategic economic statecraft—imposing tariffs, forging deals, and reacting to global events. Agent behaviors are driven by foundational economic principles, game theory, and live data feeds, fostering emergent, insightful scenarios.',
    bannerUrl:'https://www.world.fun/tradeclash.jpg',
    createdAt: 1747115954000
  },
  {
    id:'aitown',
    size: 20,
    world:'AITOWN',
    status: 'LIVE',
    link: 'https://app.world.fun/aitown',
    tokenName:'Genesis AI Town',
    description:'Genesis AI Town is the first multi agent simulation featuring more than 100 agents living, collaborating, and evolving together in an ever changing environment.',
    bannerUrl:'https://awe-worldfun.s3.ap-southeast-1.amazonaws.com/world.fun/ai-town-banner.jpg',
    createdAt: 1743307664000
  },
  {
    id:'marsx',
    size: 20,
    world:'MARSX',
    status: 'LIVE',
    link: 'https://app.world.fun/marsx',
    tokenName:'AI MarsX',
    description:'MarsX simulates a Mars exploration through AI powered rovers called Atlas units. These companions prospect the terrain, claim mineral deposits for their users, and enable simulating a colony on Mars.',
    bannerUrl:'https://awe-worldfun.s3.ap-southeast-1.amazonaws.com/world.fun/marsX-banner.png',
    createdAt: 1744775166000
  },
  {
    id:'sharktank',
    size: 30,
    world:'SHARKTANK',
    targetFundRaise: 2000000,
    totalAweRaised: '2000000000000000000000000',
    status: 'LIVE',
    link: 'https://www.world.fun/aisharktank',
    tokenName:'AI Shark Tank',
    description:'Shark Tank is a news-driven AI economy simulation. It offers a dynamic simulation of the global economy, where twelve AI-controlled Country Agents react to real time news events and users speculate on outcomes.',
    bannerUrl:'https://staging.world.fun/aisharktank.jpg',
    createdAt: 1743996932000
  }
]


export default function NetworkGraph({ onClickProject }: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  
  // Get tokens data
  const { data: tokensData, loading } = useTokensSearch(1, 100);
  
  // Get agents list (with local storage)
  const { data: agentsData, loading: agentsLoading } = useAgents();

  // Create a mapping table from agent name to world, stored locally
  const agentWorldMap = useMemo(() => {
    const map: Record<string, string> = {};
    const STORAGE_KEY = 'agent_world_map';
    
    // Check if in browser environment
    const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    
    if (agentsData && agentsData.length > 0) {
      agentsData.forEach((agent: any) => {
        if (agent.name && agent.world) {
          map[agent.name] = agent.world;
        }
      });
      
      // Store to local storage (only in browser environment)
      if (isBrowser) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
        } catch (error) {
          console.error('Failed to save agent world map to localStorage:', error);
        }
      }
    } else {
      // If agentsData is empty, try to read from local storage (only in browser environment)
      if (isBrowser) {
        try {
          const cachedMap = localStorage.getItem(STORAGE_KEY);
          if (cachedMap) {
            return JSON.parse(cachedMap);
          }
        } catch (error) {
          console.error('Failed to parse cached agent world map:', error);
        }
      }
    }
    
    return map;
  }, [agentsData]);

  // Process data: merge worlds and tokens and convert to graph nodes and edges
  const graphData = useMemo(() => {
    const nodes: any[] = [];
    const edges: any[] = [];

    // Create default center node (independent of request data)
    const centerNode = {
      id: 'center',
      size: 88,
      img: '/graph.svg',
      data:'center',
    };
    nodes.push(centerNode);

    // Convert worlds to nodes, emit edges from center point
    worlds.forEach((world) => {
      const worldNode = {
        id: `world-${world.id}`,
        size: world.size,
        img: '/graph-orange.svg', // Use orange SVG
        // label: world.world,
        // worldId: world.id,
        // isWorld: true,
        data:world,
      };
      nodes.push(worldNode);

      // Connect from center point to world node, add identifier to indicate this is a world edge
      edges.push({
        source: 'center',
        target: `world-${world.id}`,
        isWorldEdge: true,
      });
    });
    // If there is tokens data, convert all tokens to nodes
    // Process tokens with tokenType WORLD_IDEA_TOKEN and WORLD_AGENT
    if (tokensData?.tokens && tokensData.tokens.length > 0) {
      tokensData.tokens
        .filter((token: any) => 
          token.tokenType === 'WORLD_IDEA_TOKEN' || token.tokenType === 'WORLD_AGENT'
        )
        .forEach((token: any) => {
          const node = {
            id: `token-${token.id}`,
            size: [6, 8, 10][Math.floor(Math.random() * 3)],
            img: token.status === 'LIVE' ? '/graph-orange.svg' : '/graph.svg',
            label: token.tokenName || token.tokenSymbol,
            tokenId: token.id,
            tokenSymbol: token.tokenSymbol,
            isLeaf: true,
            data:token,
          };
          nodes.push(node);

          let matchedWorld = null;

          // If it's WORLD_AGENT type, find corresponding world through agentName
          if (token.tokenType === 'WORLD_AGENT' && token.agentName) {
            const worldName = agentWorldMap[token.agentName];
            if (worldName) {
              // Find matching world in worlds list
              matchedWorld = worlds.find((w) => 
                w.world?.toLowerCase() === worldName.toLowerCase() ||
                w.id?.toLowerCase() === worldName.toLowerCase()
              );
            }
          } 
          // If it's WORLD_IDEA_TOKEN type, use original matching logic
          else if (token.tokenType === 'WORLD_IDEA_TOKEN') {
            matchedWorld = worlds.find((w) => 
              token.worldId === w.id || 
              token.world?.toLowerCase() === w.id.toLowerCase() ||
              token.worldId?.toLowerCase() === w.id.toLowerCase()
            );
          }

          if (matchedWorld) {
            edges.push({
              source: `world-${matchedWorld.id}`,
              target: `token-${token.id}`,
            });
          } else {
            // If no matching world, emit from center point
            edges.push({
              source: 'center',
              target: `token-${token.id}`,
              isLiveTokenEdge: token.status === 'LIVE',
            });
          }
        });
    }

    return { nodes, edges };
  }, [tokensData, agentWorldMap]);

  useEffect(() => {
    if (!containerRef.current || loading || agentsLoading) return;

    // Clean up previous graph instance
    if (graphRef.current) {
      graphRef.current.destroy();
      graphRef.current = null;
    }

    // Create graph instance - use force-directed layout
    try {
      const graph = new Graph({
        container: containerRef.current,
        // width,
        // height,
        data: graphData,
        autoFit: {
          type: 'view', // 
          options: {
            when: 'overflow', // 
            direction: 'both', // 
          },
          animation: {
            duration: 1000, // 
            easing: 'ease-in-out', // 
          },
        },
        layout: {
          type: 'd3-force',
          link: {
            distance: (d: any) => {
              if (d.source.id === 'center') {
                // Distance from center to world node with random variation (180-220)
                return 180 + Math.random() * 40;
              }
              // Distance from world to token node with random variation (30-50)
              return 30 + Math.random() * 20;
            },
          }
        },
        node: {
          type: (d: any) =>  'circle',
          style: (d: any) => {
            const size = d.size || 30;
            // Use the img property from node data, default to '/graph.svg' if not set
            const iconSrc = d.img || '/graph.svg';
            const haloStroke = d.img === '/graph.svg' ? '#FFF' : '#FF8C00';
            return {
              size,
              iconSrc,
              iconWidth: size,
              iconHeight: size,
              iconRadius: size,
              iconClip: 'circle',
              // halo: true,
              haloLineWidth: 20,
              haloStroke: haloStroke,
              haloBlur: 10,
            };
          },
          
        },
        edge: {
          type: 'line',
          style: {
            stroke: (data: any) => {
              // If it's a world edge, use orange color
              if (data.isWorldEdge) {
                return '#FF8C00'; // Orange
              }
              // If it's an edge to a LIVE token, use orange color
              if (data.isLiveTokenEdge) {
                return '#FF8C00'; // Orange
              }
              return '#707070'; // Default gray
            },
            lineWidth: (data: any) => {
              return 1;
            },
          },
        },
        behaviors: ['drag-element-force', 'drag-canvas','hover-activate'],
      });

      graphRef.current = graph;
      
      graph.render();
      
      // Add node click event after rendering completes
      graph.on(NodeEvent.CLICK, (evt) => {
        const { target } = evt as any;
        const nodeId = target.id;
        
        
        const nodeData = graph.getNodeData(nodeId);
        if(nodeData.id === 'center') return;
        onClickProject && onClickProject(nodeData.data);
        
      });

      return () => {
        if (graphRef.current) {
          graphRef.current.destroy();
          graphRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error creating G6 graph:', error);
    }
  }, [graphData, loading, agentsLoading]);

  return (
    <Box
      ref={containerRef}
      // width={`${width}px`}
      // height={`${height}px`}
      minH={{base: '400px', md: '600px', xl: '640px'}}
      position="relative"
    />
  );
}

