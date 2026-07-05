'use client';

import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEffect } from 'react';

interface TreeNode {
  id: string;
  label: string;
  type: string;
}

interface TreeEdge {
  source: string;
  target: string;
}

interface TreeData {
  treeNodes?: TreeNode[];
  treeEdges?: TreeEdge[];
}

export default function ReadinessTree({ data }: { data: TreeData }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (!data?.treeNodes) return;
    
    // Convert API nodes to React Flow format
    const formattedNodes = data.treeNodes.map((n: TreeNode, idx: number) => {
      let bg = '#374151', color = 'white', border = '1px solid #4b5563';
      let y = 150, x = 100 + (idx * 150);

      if (n.type === 'current') {
        bg = '#1f2937'; border = '1px solid #374151'; y = 50; x = 250;
      } else if (n.type === 'gap') {
        bg = 'rgba(239, 68, 68, 0.1)'; color = '#fca5a5'; border = '1px solid rgba(239, 68, 68, 0.3)';
      } else if (n.type === 'target') {
        bg = 'var(--accent-secondary)'; color = 'white'; border = 'none'; y = 250; x = 250;
      }

      return {
        id: n.id,
        position: { x, y },
        data: { label: n.label },
        style: { background: bg, color, border, borderRadius: '12px', padding: '15px', fontWeight: n.type === 'target' ? 'bold' : 'normal' }
      };
    });

    const formattedEdges = (data.treeEdges || []).map((e: TreeEdge, idx: number) => ({
      id: `e${e.source}-${e.target}-${idx}`,
      source: e.source,
      target: e.target,
      animated: true,
      style: { stroke: '#9ca3af' }
    }));

    setNodes(formattedNodes);
    setEdges(formattedEdges);
  }, [data, setNodes, setEdges]);

  const onConnect = useCallback((params: unknown) => setEdges((eds) => addEdge(params as import('@xyflow/react').Connection, eds)), [setEdges]);

  return (
    <div className="w-full h-[500px] bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h3 className="text-xl font-bold text-white mb-1">Production Readiness Path</h3>
        <p className="text-xs text-gray-400">Your optimal skill tree to reach the target role.</p>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="bg-black/40"
      >
        <Controls className="bg-gray-800 fill-gray-400 border-gray-700" />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.id) {
              case '1': return '#1f2937';
              case '4': return '#8b5cf6';
              default: return '#374151';
            }
          }}
          maskColor="rgba(0,0,0,0.7)"
          className="bg-gray-900 border border-gray-800"
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#374151" />
      </ReactFlow>
    </div>
  );
}
