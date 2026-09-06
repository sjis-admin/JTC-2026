'use client';

import React, { useEffect, useState } from 'react';
import { adminFetch, EventItem } from '@/lib/api';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Plus, Edit2, Trash2, Check, Sparkles, AlertCircle } from 'lucide-react';

const CATEGORY_CHOICES = [
  { value: 'AI', label: 'AI & Machine' },
  { value: 'CODING', label: 'Coding Marathon' },
  { value: 'ROBOTICS', label: 'Robotics & Hardware' },
  { value: 'DRONE', label: 'Drone Challenge' },
  { value: 'ESPORTS', label: 'E-Sports' },
  { value: 'DIGITAL_ART', label: 'Digital Art & Poster' },
  { value: 'PHOTOGRAPHY', label: 'Photography' },
  { value: 'MULTIMEDIA', label: 'Montage & Video' },
  { value: 'PRESENTATION', label: 'PowerPoint Presentation' },
  { value: 'TYPING', label: 'Speed Typing' },
  { value: 'QUIZ', label: 'Quizzes' },
  { value: 'OTHER', label: 'Other Arenas' },
];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // New Event Form State
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newCategory, setNewCategory] = useState('AI');
  const [newEventType, setNewEventType] = useState<'INDIVIDUAL' | 'TEAM' | 'BOTH'>('INDIVIDUAL');
  const [newIndividualFee, setNewIndividualFee] = useState(200);
  const [newTeamFee, setNewTeamFee] = useState(0);
  const [newVenue, setNewVenue] = useState('Computer Lab');
  const [newDesc, setNewDesc] = useState('');
  const [newRules, setNewRules] = useState('');
  const [newCriteria, setNewCriteria] = useState('');

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/admin/events/');
      if (res.ok) {
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : data.results || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    setSaving(true);
    try {
      const res = await adminFetch(`/admin/events/${editingEvent.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: editingEvent.name,
          category: editingEvent.category,
          event_type: editingEvent.event_type,
          individual_fee: editingEvent.individual_fee,
          team_fee: editingEvent.team_fee,
          venue_detail: editingEvent.venue_detail,
          description: editingEvent.description,
          rules: editingEvent.rules,
          judging_criteria: editingEvent.judging_criteria,
          is_active: editingEvent.is_active,
          highlight: editingEvent.highlight,
          order: editingEvent.order,
        }),
      });

      if (res.ok) {
        setEditingEvent(null);
        loadEvents();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setSaving(true);
    try {
      const slug = newSlug.trim() || newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const res = await adminFetch('/admin/events/', {
        method: 'POST',
        body: JSON.stringify({
          name: newName.trim(),
          slug: slug,
          category: newCategory,
          event_type: newEventType,
          individual_fee: newIndividualFee,
          team_fee: newTeamFee,
          venue_detail: newVenue.trim(),
          description: newDesc.trim(),
          rules: newRules.trim(),
          judging_criteria: newCriteria.trim(),
          is_active: true,
          highlight: false,
          icon: 'Sparkles',
        }),
      });

      if (res.ok) {
        setIsCreating(false);
        setNewName('');
        setNewSlug('');
        setNewDesc('');
        setNewRules('');
        setNewCriteria('');
        loadEvents();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await adminFetch(`/admin/events/${id}/`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Competitions Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Add new competitions, update fees, edit rules, or configure eligibility across all 17 arenas.
          </p>
        </div>

        <Button variant="glow" size="sm" onClick={() => setIsCreating(true)} className="font-bold">
          <Plus className="w-4 h-4 mr-1.5" /> Add New Event
        </Button>
      </div>

      <Card glow="none" className="p-0 border border-surface-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-surface-elevated text-slate-400 border-b border-surface-border font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">#</th>
                <th className="p-3.5">Event Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Fee</th>
                <th className="p-3.5">Active</th>
                <th className="p-3.5">Featured</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {events.map((ev, idx) => (
                <tr key={ev.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5 font-mono text-slate-500">{ev.order || idx + 1}</td>
                  <td className="p-3.5 font-bold text-white text-sm">{ev.name}</td>
                  <td className="p-3.5">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-elevated text-gold-light border border-surface-border">
                      {ev.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-300">{ev.event_type}</td>
                  <td className="p-3.5 font-mono font-bold text-gold">{ev.fee_display}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ev.is_active ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      {ev.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {ev.highlight ? (
                      <Badge variant="gold" size="sm">Featured</Badge>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => setEditingEvent(ev)}
                      className="px-2.5 py-1 rounded bg-surface-elevated border border-surface-border text-gold hover:text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ev.id, ev.name)}
                      className="px-2 py-1 rounded bg-surface-elevated border border-surface-border text-rose-400 hover:text-rose-200 text-xs font-semibold cursor-pointer inline-flex items-center"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CREATE NEW EVENT MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-elevated border border-gold/40 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-gold" /> Add New Competition
              </h3>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Competition Name"
                  required
                  placeholder="e.g. AI Prompting"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Input
                  label="URL Slug (Optional)"
                  placeholder="e.g. ai-prompting"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-200 uppercase block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-surface-border text-white focus:outline-none focus:border-gold"
                  >
                    {CATEGORY_CHOICES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200 uppercase block mb-1">Type</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-surface-border text-white focus:outline-none focus:border-gold"
                  >
                    <option value="INDIVIDUAL">Individual Solo</option>
                    <option value="TEAM">Team Participation</option>
                    <option value="BOTH">Solo or Team</option>
                  </select>
                </div>

                <Input
                  label="Venue / Room"
                  placeholder="e.g. Computer Lab 1"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Individual Fee (BDT)"
                  type="number"
                  value={newIndividualFee}
                  onChange={(e) => setNewIndividualFee(parseInt(e.target.value) || 0)}
                />
                <Input
                  label="Team Fee (BDT)"
                  type="number"
                  value={newTeamFee}
                  onChange={(e) => setNewTeamFee(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-200 uppercase block">Short Overview / Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief 1-2 sentence description..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-surface-border text-white text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-200 uppercase block">Rules & Regulations (Markdown)</label>
                <textarea
                  rows={4}
                  placeholder="Rule 1: Bring your own device..."
                  value={newRules}
                  onChange={(e) => setNewRules(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-surface-border text-white text-xs font-mono focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-border">
                <Button variant="secondary" type="button" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button variant="glow" type="submit" isLoading={saving} className="font-bold">
                  Create Competition
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EVENT MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-elevated border border-gold/40 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="text-lg font-bold text-white">Edit: {editingEvent.name}</h3>
              <button onClick={() => setEditingEvent(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <Input
                label="Event Name"
                value={editingEvent.name}
                onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Individual Fee (BDT)"
                  type="number"
                  value={editingEvent.individual_fee}
                  onChange={(e) => setEditingEvent({ ...editingEvent, individual_fee: parseInt(e.target.value) || 0 })}
                />
                <Input
                  label="Team Fee (BDT)"
                  type="number"
                  value={editingEvent.team_fee}
                  onChange={(e) => setEditingEvent({ ...editingEvent, team_fee: parseInt(e.target.value) || 0 })}
                />
              </div>

              <Input
                label="Venue Detail"
                value={editingEvent.venue_detail || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, venue_detail: e.target.value })}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-slate-300">Rules & Format (Markdown)</label>
                <textarea
                  rows={6}
                  value={editingEvent.rules || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, rules: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-white text-xs font-mono focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center gap-6 pt-2 text-xs">
                <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingEvent.is_active}
                    onChange={(e) => setEditingEvent({ ...editingEvent, is_active: e.target.checked })}
                    className="accent-gold"
                  />
                  <span>Active for Registration</span>
                </label>

                <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingEvent.highlight}
                    onChange={(e) => setEditingEvent({ ...editingEvent, highlight: e.target.checked })}
                    className="accent-gold"
                  />
                  <span>Feature on Home Page</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-border">
                <Button variant="secondary" type="button" onClick={() => setEditingEvent(null)}>
                  Cancel
                </Button>
                <Button variant="glow" type="submit" isLoading={saving} className="font-bold">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
