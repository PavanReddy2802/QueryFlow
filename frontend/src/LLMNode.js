// src/LLMNode.js
import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'react-flow-renderer';

const LLMNode = ({ data }) => {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [model, setModel] = useState('gpt-3.5');
  const [inputText, setInputText] = useState('');

  // Update inputText when QueryNode sends new data
  useEffect(() => {
    if (data?.input) {
      setInputText(data.input);
    }
  }, [data?.input]);

  const handleGenerate = () => {
    if (!inputText) {
      setAnswer('⚠️ No input from Query Node.');
      return;
    }

    const lowerPrompt = prompt.toLowerCase();
    let result = '';

    if (lowerPrompt.includes('email')) {
      const match = inputText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i);
      result = `📧 Email: ${match?.[0] || 'Not found'}`;
    } else if (lowerPrompt.includes('phone') || lowerPrompt.includes('contact')) {
      const match = inputText.match(/(?:\+91[-\s]?|0)?[6-9]\d{9}/);
      result = `📱 Phone: ${match?.[0] || 'Not found'}`;
    } else if (lowerPrompt.includes('skills')) {
      result = `🛠️ Skills: ${inputText}`;
    } else if (lowerPrompt.includes('certification')) {
      result = `🎓 Certifications: ${inputText}`;
    } else {
      result = `📘 (${model}) Summary: ${inputText.slice(0, 300)}...`;
    }

    setAnswer(result);

    if (data?.onAnswerPush) {
      data.onAnswerPush(result);
    }
  };

  return (
    <div style={{ border: '1px solid #666', background: '#fff', padding: 10, width: 250 }}>
      <strong>LLM Node</strong>
      <div style={{ marginTop: 8 }}>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          style={{ width: '100%', marginBottom: 6 }}
        >
          <option value="gpt-3.5">gpt-3.5</option>
          <option value="gpt-4">gpt-4</option>
          <option value="text-embedding-3-small">embedding-3-small</option>
          <option value="text-embedding-3-large">embedding-3-large</option>
        </select>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask about the above info..."
          style={{ width: '100%', height: 50, marginBottom: 6 }}
        />

        <button onClick={handleGenerate} style={{ width: '100%' }}>
          Generate Answer
        </button>

        {answer && (
          <div
            style={{
              marginTop: 10,
              background: '#f2f2f2',
              padding: 8,
              fontSize: '0.8em',
              whiteSpace: 'pre-wrap',
              maxHeight: 150,
              overflowY: 'auto',
            }}
          >
            {answer}
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default LLMNode;
