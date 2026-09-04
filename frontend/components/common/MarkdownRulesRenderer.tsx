import React from 'react';

interface MarkdownRulesRendererProps {
  content: string;
  className?: string;
}

type Block =
  | { type: 'h3'; text: string }
  | { type: 'h4'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: { num: string; text: string }[] }
  | { type: 'p'; text: string };

function renderInline(text: string): React.ReactNode[] {
  // Regex matches `code` or **bold**
  const regex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-white">
          {boldText}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      const codeText = part.slice(1, -1);
      return (
        <code
          key={index}
          className="font-mono text-xs px-1.5 py-0.5 rounded bg-surface-dark border border-surface-border text-gold"
        >
          {codeText}
        </code>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function MarkdownRulesRenderer({ content, className = '' }: MarkdownRulesRendererProps) {
  if (!content) return null;

  const lines = content.split('\n');
  const blocks: Block[] = [];
  let currentList: { type: 'ul' | 'ol'; items: any[] } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      if (currentList) {
        blocks.push(currentList as Block);
        currentList = null;
      }
      continue;
    }

    if (trimmed.startsWith('### ')) {
      if (currentList) {
        blocks.push(currentList as Block);
        currentList = null;
      }
      blocks.push({ type: 'h3', text: trimmed.replace(/^###\s+/, '') });
    } else if (trimmed.startsWith('#### ')) {
      if (currentList) {
        blocks.push(currentList as Block);
        currentList = null;
      }
      blocks.push({ type: 'h4', text: trimmed.replace(/^####\s+/, '') });
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.replace(/^[-*]\s+/, '');
      if (currentList && currentList.type === 'ul') {
        currentList.items.push(itemText);
      } else {
        if (currentList) blocks.push(currentList as Block);
        currentList = { type: 'ul', items: [itemText] };
      }
    } else if (/^\d+\.\s+/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (match) {
        const num = match[1];
        const itemText = match[2];
        if (currentList && currentList.type === 'ol') {
          currentList.items.push({ num, text: itemText });
        } else {
          if (currentList) blocks.push(currentList as Block);
          currentList = { type: 'ol', items: [{ num, text: itemText }] };
        }
      } else {
        if (currentList) {
          blocks.push(currentList as Block);
          currentList = null;
        }
        blocks.push({ type: 'p', text: trimmed });
      }
    } else {
      if (currentList) {
        blocks.push(currentList as Block);
        currentList = null;
      }
      blocks.push({ type: 'p', text: trimmed });
    }
  }

  if (currentList) {
    blocks.push(currentList as Block);
  }

  return (
    <div className={`space-y-3 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h3':
            return (
              <h3
                key={idx}
                className="text-sm sm:text-base font-bold text-gold-light first:mt-0 mt-5 pt-3 pb-1 border-b border-surface-border/80 flex items-center gap-2 tracking-wide"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {renderInline(block.text)}
              </h3>
            );

          case 'h4':
            return (
              <h4
                key={idx}
                className="text-xs sm:text-sm font-semibold text-slate-100 first:mt-0 mt-4 mb-1 flex items-center gap-1.5 text-gold/90"
              >
                {renderInline(block.text)}
              </h4>
            );

          case 'ul':
            return (
              <ul key={idx} className="space-y-2 my-2.5 pl-1">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5 text-slate-300">
                    <span className="text-gold text-xs mt-0.5 shrink-0 select-none">•</span>
                    <span className="leading-relaxed flex-1">{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case 'ol':
            return (
              <ol key={idx} className="space-y-2.5 my-2.5 pl-1">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5 text-slate-300">
                    <span className="font-mono text-[11px] font-bold text-sky-400 bg-sky-950/70 border border-sky-800/40 rounded px-1.5 py-0.5 shrink-0 mt-0.5 select-none">
                      {item.num}
                    </span>
                    <span className="leading-relaxed flex-1">{renderInline(item.text)}</span>
                  </li>
                ))}
              </ol>
            );

          case 'p':
            return (
              <p key={idx} className="text-slate-300 leading-relaxed my-2">
                {renderInline(block.text)}
              </p>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
