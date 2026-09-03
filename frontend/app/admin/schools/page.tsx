'use client';

import React, { useEffect, useState } from 'react';
import { adminFetch, SchoolItem } from '@/lib/api';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, Edit2, School } from 'lucide-react';

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newShortName, setNewShortName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadSchools = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/admin/schools/');
      if (res.ok) {
        const data = await res.json();
        setSchools(Array.isArray(data) ? data : data.results || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchools();
  }, []);

  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setSubmitting(true);
    try {
      const res = await adminFetch('/admin/schools/', {
        method: 'POST',
        body: JSON.stringify({
          name: newName.trim(),
          short_name: newShortName.trim(),
          is_active: true,
          order: schools.length + 1,
        }),
      });

      if (res.ok) {
        setNewName('');
        setNewShortName('');
        loadSchools();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Participating Institutions & Schools
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Pre-populated list of schools for participant dropdown selection.
        </p>
      </div>

      {/* Add New School Form */}
      <Card glow="none" className="p-5 border border-surface-border bg-surface">
        <form onSubmit={handleAddSchool} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <Input
              label="Full Institution Name"
              required
              placeholder="e.g. SFX Greenherald International School"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Input
              label="Short Code / Acronym"
              placeholder="e.g. Greenherald"
              value={newShortName}
              onChange={(e) => setNewShortName(e.target.value)}
            />
          </div>
          <Button variant="glow" type="submit" isLoading={submitting} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-1" /> Add School
          </Button>
        </form>
      </Card>

      {/* Schools List */}
      <Card glow="none" className="p-0 border border-surface-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-surface-elevated text-slate-400 border-b border-surface-border font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">#</th>
                <th className="p-3.5">School Name</th>
                <th className="p-3.5">Short Code</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {schools.map((sch, idx) => (
                <tr key={sch.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5 font-mono text-slate-500">{idx + 1}</td>
                  <td className="p-3.5 font-bold text-white text-sm">{sch.name}</td>
                  <td className="p-3.5 font-mono text-jtc-teal">{sch.short_name || '-'}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
