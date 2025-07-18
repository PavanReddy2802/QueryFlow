import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

const OutputNode = ({ data }) => {
  return (
    <div style={{ border: '2px solid green', padding: 10, width: 250, background: '#f9fff9' }}>
      <strong>Output Node</strong>
      <div style={{
        marginTop: 8,
        fontSize: '0.85em',
        background: '#e6ffe6',
        padding: 6,
        minHeight: 80,
        whiteSpace: 'pre-wrap',
        overflowY: 'auto',
        maxHeight: 150,
      }}>
        {data?.input || 'Waiting for answer...'}
      </div>
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default OutputNode;
