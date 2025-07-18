// src/QueryNode.js
import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import axios from 'axios';

const QueryNode = ({ data }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    setLoading(true);
    setResponse('');

    try {
      const res = await axios.get(`http://localhost:8000/query`, {
        params: {
          q: query,
          collection_name: 'pavan_resume',
        },
      });

      const answer = res.data.matched_chunks?.[0] || 'No match found.';
      setResponse(answer);

      if (data?.onDataPush) data.onDataPush(answer);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error while querying.';
      setResponse(`❌ ${msg}`);
    }

    setLoading(false);
  };

  return (
    <div style={{ border: '1px solid #999', padding: 10, width: 250, background: 'white' }}>
      <strong>Query Node</strong>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask a question..."
        style={{ width: '100%', marginTop: 5 }}
      />
      <button
        onClick={handleQuery}
        disabled={loading || !query.trim()}
        style={{ marginTop: 5, width: '100%' }}
      >
        {loading ? 'Loading...' : 'Ask'}
      </button>
      {response && (
        <div style={{ marginTop: 10, fontSize: '0.8em', background: '#f4f4f4', padding: 5 }}>
          {response}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default QueryNode;
