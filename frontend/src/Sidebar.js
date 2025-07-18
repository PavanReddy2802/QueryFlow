// src/Sidebar.js
import React from 'react';

const onDragStart = (event, nodeType) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

export default function Sidebar() {
  return (
    <aside style={{
      height: '100%',
      width: 200,
      padding: 10,
      borderRight: '1px solid #ddd',
      boxSizing: 'border-box'
    }}>
      <div style={{ marginBottom: 10 }}>Drag nodes onto the canvas:</div>

      <div
        style={{ padding: 8, marginBottom: 6, background: '#eee', cursor: 'grab' }}
        onDragStart={(e) => onDragStart(e, 'query')} // ✅ correct type
        draggable
      >
        Query Node
      </div>

      <div
        style={{ padding: 8, marginBottom: 6, background: '#eee', cursor: 'grab' }}
        onDragStart={(e) => onDragStart(e, 'kb')} // for future KB node
        draggable
      >
        KB Node
      </div>

      <div
        style={{ padding: 8, marginBottom: 6, background: '#eee', cursor: 'grab' }}
        onDragStart={(e) => onDragStart(e, 'llm')} // for future LLM node
        draggable
      >
        LLM Node
      </div>

      <div
        style={{ padding: 8, background: '#eee', cursor: 'grab' }}
        onDragStart={(e) => onDragStart(e, 'output')} // for future output
        draggable
      >
        Output Node
      </div>
    </aside>
  );
}
