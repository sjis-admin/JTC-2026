'use client';

import React, { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AdminLoader } from '@/components/ui/AdminLoader';
import {
  Search, CheckCircle2, XCircle, Clock, Filter, Check, Eye, Download, FileSpreadsheet, RefreshCw, X, ShieldCheck, Sparkles, FileText,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';

interface RegistrationItem {
  confirmation_code: string;
  short_code: string;
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  participant_grade: string;
  participant_school: string;
  total_fee: number;
  payment_method: string;
  payment_reference: string;
  payment_status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'REFUNDED';
  payment_status_display: string;
  registered_at: string;
  registration_events: {
    event: { name: string };
    is_team: boolean;
    team_name: string;
    fee_charged: number;
  }[];
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedReg, setSelectedReg] = useState<RegistrationItem | null>(null);
  const [updatingCode, setUpdatingCode] = useState<string | null>(null);

  const loadRegistrations = async (
    targetPage = page,
    targetPageSize = pageSize,
    targetSearch = search,
    targetStatus = statusFilter
  ) => {
    setLoading(true);
    let url = `/admin/registrations/?page=${targetPage}&page_size=${targetPageSize}&`;
    if (targetStatus) url += `status=${targetStatus}&`;
    if (targetSearch.trim()) url += `search=${encodeURIComponent(targetSearch.trim())}&`;

    try {
      const res = await adminFetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setRegistrations(data);
          setTotalCount(data.length);
        } else {
          setRegistrations(data.results || []);
          setTotalCount(data.count || 0);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadRegistrations(1, pageSize, search, statusFilter);
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadRegistrations(1, pageSize, search, statusFilter);
  };

  const handleClearSearch = () => {
    setSearch('');
    setPage(1);
    loadRegistrations(1, pageSize, '', statusFilter);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    loadRegistrations(newPage, pageSize, search, statusFilter);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
    loadRegistrations(1, newSize, search, statusFilter);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) {
        pages.push('...');
      }
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  };

  // 1-Click Inline Status Update
  const updatePaymentStatus = async (code: string, newStatus: 'VERIFIED' | 'REJECTED' | 'PENDING') => {
    setUpdatingCode(code);
    try {
      const res = await adminFetch(`/admin/registrations/${code}/update_payment/`, {
        method: 'PATCH',
        body: JSON.stringify({ payment_status: newStatus }),
      });

      if (res.ok) {
        // Optimistically update state
        setRegistrations((prev) =>
          prev.map((r) =>
            r.confirmation_code === code
              ? {
                  ...r,
                  payment_status: newStatus,
                  payment_status_display: newStatus === 'VERIFIED' ? 'Verified' : newStatus === 'REJECTED' ? 'Rejected' : 'Pending',
                }
              : r
          )
        );
        if (selectedReg && selectedReg.confirmation_code === code) {
          setSelectedReg((prev) =>
            prev
              ? {
                  ...prev,
                  payment_status: newStatus,
                  payment_status_display: newStatus === 'VERIFIED' ? 'Verified' : newStatus === 'REJECTED' ? 'Rejected' : 'Pending',
                }
              : null
          );
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingCode(null);
    }
  };

  // Export to Native Excel (.xlsx) with 3 Rich Tabs
  const exportToExcel = async () => {
    setExportingExcel(true);
    try {
      let url = '/admin/registrations/export/excel/?';
      if (statusFilter) url += `status=${statusFilter}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await adminFetch(url);
      if (!res.ok) {
        let errMsg = 'Failed to generate Excel export.';
        try {
          const errJson = await res.json();
          if (errJson.error) errMsg = errJson.error;
        } catch (_) {}
        throw new Error(errMsg);
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      // Extract filename from header or fallback
      const disposition = res.headers.get('Content-Disposition');
      let filename = `JTC2026_Student_Registrations_${new Date().toISOString().slice(0, 10)}.xlsx`;
      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      console.error('Excel Export Error:', err);
      alert(err.message || 'Unable to export Excel file. Please try again.');
    } finally {
      setExportingExcel(false);
    }
  };

  // Export to CSV Function
  const exportToCSV = () => {
    if (registrations.length === 0) return;

    const headers = [
      'Confirmation Code',
      'Short Code',
      'Name',
      'Phone',
      'Email',
      'Institution',
      'Grade',
      'Events',
      'Total Fee (BDT)',
      'Payment Method',
      'TrxID',
      'Payment Status',
      'Registration Time',
    ];

    const rows = registrations.map((r) => [
      `"${r.confirmation_code}"`,
      `"${r.short_code}"`,
      `"${r.participant_name.replace(/"/g, '""')}"`,
      `"${r.participant_phone}"`,
      `"${r.participant_email}"`,
      `"${r.participant_school.replace(/"/g, '""')}"`,
      `"${r.participant_grade}"`,
      `"${r.registration_events.map((e) => e.event.name + (e.is_team ? ` (Team: ${e.team_name})` : '')).join('; ')}"`,
      r.total_fee,
      `"${r.payment_method}"`,
      `"${r.payment_reference || ''}"`,
      `"${r.payment_status}"`,
      `"${new Date(r.registered_at).toLocaleString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JTC_Carnival_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-gold/40 text-xs font-mono font-bold text-gold mb-1">
            <Sparkles className="w-3.5 h-3.5" /> EXECUTIVE ATTENDEE ROSTER
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Registrations & Payment Verification
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verify transaction IDs, approve entry passes, and export multi-sheet Excel workbooks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={() => loadRegistrations(page, pageSize, search, statusFilter)} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          
          {/* Native Excel (.xlsx) Export Button */}
          <Button
            variant="glow"
            size="sm"
            onClick={exportToExcel}
            isLoading={exportingExcel}
            disabled={loading}
            className="font-bold shadow-md shadow-gold/20"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 text-slate-950" /> Export to Excel (.xlsx)
          </Button>

          {/* Quick CSV Export */}
          <Button
            variant="secondary"
            size="sm"
            onClick={exportToCSV}
            disabled={registrations.length === 0 || loading}
            className="text-xs text-slate-300"
          >
            <Download className="w-3.5 h-3.5 mr-1" /> CSV (Page)
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card glow="none" className="p-4 border border-surface-border bg-surface">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Input
              placeholder="Search by contestant name, phone, school, or confirmation code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-8"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-surface-elevated transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-elevated border border-surface-border text-xs text-white focus:outline-none focus:border-gold cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending Verification</option>
              <option value="VERIFIED">Verified Only</option>
              <option value="REJECTED">Rejected</option>
              <option value="REFUNDED">Refunded</option>
            </select>
            <Button variant="secondary" type="submit" size="sm">
              <Search className="w-4 h-4 mr-1" /> Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* Registrations Table */}
      <Card glow="none" className="p-0 border border-surface-border bg-surface overflow-hidden relative min-h-[380px]">
        {loading && (
          <AdminLoader
            variant="overlay"
            title="SYNCHRONIZING ATTENDEE ROSTER"
            subtitle={`Loading page ${page} of ${totalPages}...`}
          />
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-surface-elevated text-slate-400 border-b border-surface-border font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Contestant</th>
                <th className="p-3.5">Institution & Level</th>
                <th className="p-3.5">Events</th>
                <th className="p-3.5">Fee</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {registrations.length > 0 ? (
                registrations.map((r) => {
                  const isUpdating = updatingCode === r.confirmation_code;

                  return (
                    <tr key={r.confirmation_code} className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-gold">
                        {r.short_code}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-white text-sm">{r.participant_name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{r.participant_phone}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-200">{r.participant_school}</div>
                        <div className="text-[10px] text-gold-light">{r.participant_grade}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-white">{r.registration_events.length} Arena(s)</span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                          {r.registration_events.map((e) => e.event.name).join(', ')}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-white">
                        ৳{r.total_fee}
                      </td>
                      <td className="p-3.5">
                        <span className="uppercase font-semibold block">{r.payment_method}</span>
                        <span className="font-mono text-[10px] text-slate-400">{r.payment_reference || 'Online Gateway Trx'}</span>
                      </td>
                      <td className="p-3.5">
                        <Badge
                          variant={r.payment_status === 'VERIFIED' ? 'gold' : r.payment_status === 'REJECTED' ? 'red' : 'champagne'}
                          size="sm"
                        >
                          {r.payment_status_display}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        {/* 1-Click Verify Button */}
                        {r.payment_status !== 'VERIFIED' && (
                          <button
                            onClick={() => updatePaymentStatus(r.confirmation_code, 'VERIFIED')}
                            disabled={isUpdating}
                            className="px-2.5 py-1 rounded bg-emerald-950/70 border border-emerald-600/70 text-emerald-300 hover:bg-emerald-800 hover:text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                            title="Approve & Verify Payment"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}

                        {/* 1-Click Reject Button */}
                        {r.payment_status !== 'REJECTED' && (
                          <button
                            onClick={() => updatePaymentStatus(r.confirmation_code, 'REJECTED')}
                            disabled={isUpdating}
                            className="px-2 py-1 rounded bg-rose-950/50 border border-rose-800/60 text-rose-400 hover:bg-rose-900 hover:text-white text-xs font-bold cursor-pointer inline-flex items-center"
                            title="Reject Payment"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Full Details Modal Toggle */}
                        <button
                          onClick={() => setSelectedReg(r)}
                          className="px-2.5 py-1 rounded bg-surface-elevated border border-surface-border text-gold hover:text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Pass
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    {loading ? 'Loading registrations...' : 'No registrations found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls Bar */}
        <div className="border-t border-surface-border px-4 py-3.5 bg-surface-elevated/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              Showing{' '}
              <strong className="text-white font-mono">
                {totalCount === 0 ? 0 : (page - 1) * pageSize + 1}
              </strong>
              {' '}-{' '}
              <strong className="text-white font-mono">
                {Math.min(page * pageSize, totalCount)}
              </strong>
              {' '}of{' '}
              <strong className="text-gold font-mono">{totalCount}</strong> registrations
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-xs">Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-2 py-1 rounded-lg bg-surface border border-surface-border text-xs text-white focus:outline-none focus:border-gold cursor-pointer"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Page Navigation Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handlePageChange(1)}
                disabled={page <= 1 || loading}
                className="p-1.5 rounded-lg border border-surface-border hover:bg-surface-elevated hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || loading}
                className="p-1.5 rounded-lg border border-surface-border hover:bg-surface-elevated hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 px-1">
                {getPageNumbers().map((p, idx) =>
                  p === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-1.5 text-slate-500 select-none">
                      …
                    </span>
                  ) : (
                    <button
                      key={`page-${p}`}
                      type="button"
                      onClick={() => handlePageChange(Number(p))}
                      disabled={loading}
                      className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-mono font-bold transition-all ${
                        p === page
                          ? 'bg-gold text-slate-950 shadow-sm shadow-gold/30'
                          : 'hover:bg-surface-elevated text-slate-300 border border-surface-border/80'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages || loading}
                className="p-1.5 rounded-lg border border-surface-border hover:bg-surface-elevated hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(totalPages)}
                disabled={page >= totalPages || loading}
                className="p-1.5 rounded-lg border border-surface-border hover:bg-surface-elevated hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal for Details */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-elevated border border-gold/40 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div>
                <span className="text-xs text-gold font-mono font-bold">CODE: {selectedReg.short_code}</span>
                <h3 className="text-lg font-bold text-white">{selectedReg.participant_name}</h3>
              </div>
              <button onClick={() => setSelectedReg(null)} className="text-slate-400 hover:text-white text-base">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-200">
              <div><strong>Email:</strong> {selectedReg.participant_email}</div>
              <div><strong>Phone:</strong> {selectedReg.participant_phone}</div>
              <div><strong>Institution:</strong> {selectedReg.participant_school}</div>
              <div><strong>Academic Level:</strong> {selectedReg.participant_grade}</div>
              <div><strong>TrxID / Reference:</strong> <span className="font-mono text-gold font-bold">{selectedReg.payment_reference || 'Online Gateway Trx'}</span></div>
              <div><strong>Payment Method:</strong> {selectedReg.payment_method}</div>
              <div><strong>Registered At:</strong> {new Date(selectedReg.registered_at).toLocaleString()}</div>
            </div>

            <div className="pt-2 border-t border-surface-border space-y-1.5">
              <span className="font-bold text-white text-xs block">Registered Competitions ({selectedReg.registration_events.length}):</span>
              {selectedReg.registration_events.map((re, idx) => (
                <div key={idx} className="p-2.5 rounded bg-surface flex justify-between text-xs border border-surface-border">
                  <div>
                    <span className="font-semibold text-white">{re.event.name}</span>
                    {re.is_team && <span className="block text-[10px] text-gold">Team: {re.team_name}</span>}
                  </div>
                  <span className="font-mono font-bold text-gold">৳{re.fee_charged}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-surface-border gap-2">
              <a
                href={`/verify?code=${selectedReg.confirmation_code}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gold hover:underline font-bold"
              >
                View Public Pass ↗
              </a>
              <div className="flex items-center gap-2">
                {selectedReg.payment_status !== 'VERIFIED' && (
                  <Button
                    variant="glow"
                    size="sm"
                    onClick={() => updatePaymentStatus(selectedReg.confirmation_code, 'VERIFIED')}
                    className="font-bold"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" /> Mark Verified
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => setSelectedReg(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
