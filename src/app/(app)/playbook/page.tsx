'use client';

import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { DiscreetText } from '@/components/DiscreetText';
import { PlaybookItem } from '@/lib/types';
import Link from 'next/link';
import { Pin, ArrowRight, X } from 'lucide-react';
import { actionLibrary } from '@/lib/action-library';
import { useDiscreet } from '@/components/DiscreetProvider';

export default function PlaybookPage() {
  const { playbookItems, deletePlaybookItem } = useAppStore();
  const { discreetModeEnabled } = useDiscreet();
  
  const [filter, setFilter] = useState<'all' | 'strategy' | 'preparation brief'>('all');

  const items = useMemo(() => {
    let result = Object.values(playbookItems) as PlaybookItem[];
    if (filter !== 'all') {
      result = result.filter(item => item.type === filter);
    }
    // Sort pinned first, then by date desc
    return result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [playbookItems, filter]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Remove this item from your Playbook?')) {
      deletePlaybookItem(id);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto font-sans pb-32">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-[var(--eh-lilac)]">My Playbook</h1>
        <p className="text-[var(--eh-lilac)] text-sm mt-1">Your saved strategies and preparation briefs.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-[var(--eh-plum)] text-white' : 'bg-white text-[var(--eh-plum)] border border-[var(--eh-plum)] hover:bg-[var(--eh-canvas)]'}`}
        >
          All Items
        </button>
        <button 
          onClick={() => setFilter('strategy')}
          className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === 'strategy' ? 'bg-[var(--eh-plum)] text-white' : 'bg-white text-[var(--eh-plum)] border border-[var(--eh-plum)] hover:bg-[var(--eh-canvas)]'}`}
        >
          Strategies
        </button>
        <button 
          onClick={() => setFilter('preparation brief')}
          className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === 'preparation brief' ? 'bg-[var(--eh-plum)] text-white' : 'bg-white text-[var(--eh-plum)] border border-[var(--eh-plum)] hover:bg-[var(--eh-canvas)]'}`}
        >
          Preparation Briefs
        </button>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="bg-[var(--eh-paper)] border border-[var(--eh-line)] rounded-[var(--eh-card-radius)] p-8 text-center">
            <p className="text-[var(--eh-muted)] mb-4">Your playbook is empty.</p>
            <p className="text-sm text-[var(--eh-muted)]">When you find an action card or build a preparation brief that works well for you, save it here to build your personal library.</p>
          </div>
        ) : (
          items.map(item => {
            const isBrief = item.type === 'preparation brief';
            const actionCard = !isBrief && item.source_id ? actionLibrary.find(a => a.id === item.source_id) : null;
            
            return (
              <Link 
                href={isBrief ? `/prepare/${item.source_id}` : '#'} 
                key={item.id}
                className={`block bg-white p-5 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] border ${item.pinned ? 'border-[var(--eh-plum)]' : 'border-gray-100'} hover:border-[var(--eh-mauve)] transition-all relative group`}
              >
                <button onClick={(e) => handleDelete(item.id, e)} className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={16} />
                </button>
                
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {item.pinned && <Pin size={14} className="text-[var(--eh-plum)] fill-[var(--eh-plum)]" />}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--eh-muted)]">{item.type}</span>
                  </div>
                </div>
                
                <h3 className="font-serif font-bold text-lg text-[var(--eh-plum)] mb-2 pr-6 leading-tight">
                  <DiscreetText fallbackLabel={`Saved ${item.type}`} forceShow={!discreetModeEnabled}>
                    {item.user_title}
                  </DiscreetText>
                </h3>
                
                {actionCard && (
                  <p className="text-sm text-[var(--eh-ink)] line-clamp-2 mb-3">
                    <DiscreetText fallbackLabel="Action instruction">{actionCard.instruction}</DiscreetText>
                  </p>
                )}
                
                {isBrief && (
                  <div className="text-sm text-[var(--eh-plum)] font-bold flex items-center gap-1 mt-4">
                    Open brief <ArrowRight size={14} />
                  </div>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
