// Example (not published)
import React from 'react';
import { createRoot } from 'react-dom/client';
import { SafeMarkdown } from '../dist/index.js';

const md = `# Hello **world**\n\n- [External](https://example.com)\n- ![Img](https://images.example.com/x.png)\n`;

const App = () => (
  <div className="prose max-w-none">
    <SafeMarkdown markdown={md} allowedImageHosts={["images.example.com"]} />
  </div>
);

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
