// src/NodeConfigPanel.js
import React from 'react';

export default function NodeConfigPanel({ selectedNode, onUpdate }) {
  if (!selectedNode) {
    return (
      <aside style={{ width: 250, padding: 10, borderLeft: '1px solid #ddd' }}>
        <h4>No node selected</h4>
      </aside>
    );
  }

  const handleChange = (e) => {
    onUpdate({ ...selectedNode, data: { ...selectedNode.data, label: e.target.value } });
  };

  return (
    <aside style={{ width: 250, padding: 10, borderLeft: '1px solid #ddd' }}>
      <h4>Node Configuration</h4>
      <label>
        Label:
        <input
          type="text"
          value={selectedNode.data.label}
          onChange={handleChange}
          style={{ width: '100%', marginTop: 5 }}
        />
      </label>
    </aside>
  );
}
