// src/App.js
import React, { useState, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls
} from 'react-flow-renderer';
import Sidebar from './Sidebar';
import NodeConfigPanel from './NodeConfigPanel';
import QueryNode from './QueryNode';
import LLMNode from './LLMNode';
import OutputNode from './OutputNode';
import './App.css';

// Register custom node types
const nodeTypes = {
  query: QueryNode,
  llm: LLMNode,
  output: OutputNode
};

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start Node' },
    position: { x: 250, y: 5 },
  },
];
const initialEdges = [];

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  // Pass data from one node to connected targets
  const pushDataToTarget = (sourceId, dataValue) => {
    const connectedTargets = edges
      .filter((e) => e.source === sourceId)
      .map((e) => e.target);

    setNodes((nds) =>
      nds.map((node) => {
        if (connectedTargets.includes(node.id)) {
          return {
            ...node,
            data: {
              ...node.data,
              input: dataValue,
            },
          };
        }
        return node;
      })
    );
  };

  // Create new edges
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // Handle node click
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Allow drag over for dropping
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop of new nodes
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (!nodeType) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };

      const newId = `${+new Date()}`;
      const newNode = {
        id: newId,
        type: nodeType,
        position,
        data: {
          label: `${nodeType} node`,
          ...(nodeType === 'query' && {
            onDataPush: (val) => pushDataToTarget(newId, val),
          }),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [edges, pushDataToTarget]
  );

  // Update a node's data (used by config panel)
  const updateNode = (updatedNode) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === updatedNode.id ? updatedNode : node))
    );
    setSelectedNode(updatedNode);
  };

  // Inject push callbacks into existing query & llm nodes
  const customNodes = nodes.map((node) => {
    if (node.type === 'query') {
      return {
        ...node,
        data: {
          ...node.data,
          onDataPush: (val) => pushDataToTarget(node.id, val),
        },
      };
    } else if (node.type === 'llm') {
      return {
        ...node,
        data: {
          ...node.data,
          onAnswerPush: (val) => pushDataToTarget(node.id, val),
        },
      };
    }
    return node;
  });

  // ─── Save / Load Flow ───────────────────────────────────────────────────
  const saveFlow = () => {
    const flow = { nodes, edges };
    window.localStorage.setItem('savedFlow', JSON.stringify(flow));
    alert('Flow saved!');
  };

  const loadFlow = () => {
    const json = window.localStorage.getItem('savedFlow');
    if (json) {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(json);
      setNodes(savedNodes);
      setEdges(savedEdges);
      alert('Flow loaded!');
    } else {
      alert('No saved flow found');
    }
  };
  // ────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <Sidebar />

      <div style={{ flexGrow: 1, position: 'relative' }}>
        {/* Save/Load Buttons */}
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
          <button onClick={saveFlow} style={{ marginRight: 8 }}>Save Flow</button>
          <button onClick={loadFlow}>Load Flow</button>
        </div>

        {/* Canvas */}
        <div
          style={{ width: '100%', height: '100%' }}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={customNodes}
            edges={edges}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>

      <NodeConfigPanel selectedNode={selectedNode} onUpdate={updateNode} />
    </div>
  );
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
