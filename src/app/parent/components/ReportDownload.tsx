'use client';

import React, { useState } from 'react';
import type { ParentSettings } from './SettingsPanel';

export interface ReportRow {
  id: string;
  storyTitle: string;
  childName?: string;
  subject: string;
  activity: string;
  score: number;
  total: number;
  dateTime: string;
  level?: string;
}

interface ReportDownloadProps {
  rows: ReportRow[];
  settings: ParentSettings;
}

function buildChildPDF(childName: string, rows: ReportRow[], settings: ParentSettings) {
  // Dynamic import jsPDF to avoid SSR issues
  const { jsPDF } = require('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const childData = settings.children[childName];
  const displayName = childData?.name ?? childName;
  const childClass = childData?.class ?? 4;
  const childRows = rows.filter((r) => r.childName === childName || r.childName === displayName);

  const totalAttempts = childRows.length;
  const avgScore = totalAttempts > 0
    ? Math.round((childRows.reduce((s, r) => s + (r.total > 0 ? r.score / r.total : 0), 0) / totalAttempts) * 100)
    : 0;
  const perfectScores = childRows.filter((r) => r.total > 0 && r.score === r.total).length;

  // ── HEADER ──
  doc.setFillColor(109, 40, 217);
  doc.rect(0, 0, 210, 38, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('KKZ Learning Hub', 105, 14, { align: 'center' });
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.text('Student Progress Report', 105, 24, { align: 'center' });
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`, 105, 33, { align: 'center' });

  // ── CHILD INFO ──
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(displayName, 20, 54);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(109, 40, 217);
  doc.text(`Class ${childClass}`, 20, 62);
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(9);
  doc.text(`Total Activities Completed: ${totalAttempts}`, 120, 54);
  doc.text(`Reporting Period: March 2026`, 120, 62);

  // Divider
  doc.setDrawColor(233, 213, 255);
  doc.setLineWidth(0.5);
  doc.line(20, 67, 190, 67);

  // ── STATS CARDS ──
  doc.setTextColor(88, 28, 135);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('OVERALL PERFORMANCE', 20, 77);

  const statsY = 82;
  const statBoxes = [
    { label: 'Total Attempts', value: String(totalAttempts), color: [237, 233, 254] as [number,number,number] },
    { label: 'Average Score', value: `${avgScore}%`, color: avgScore >= 80 ? [220, 252, 231] as [number,number,number] : avgScore >= 50 ? [254, 249, 195] as [number,number,number] : [254, 226, 226] as [number,number,number] },
    { label: 'Perfect Scores', value: String(perfectScores), color: [255, 237, 213] as [number,number,number] },
  ];

  statBoxes.forEach((box, i) => {
    const x = 20 + i * 58;
    doc.setFillColor(...box.color);
    doc.roundedRect(x, statsY, 54, 22, 3, 3, 'F');
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(88, 28, 135);
    doc.text(box.value, x + 27, statsY + 12, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(box.label, x + 27, statsY + 19, { align: 'center' });
  });

  // ── SUBJECT BREAKDOWN SUMMARY ──
  const summaryY = statsY + 30;
  doc.setTextColor(88, 28, 135);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('PERFORMANCE BY SUBJECT', 20, summaryY);

  // Build per-subject averages
  const subjects = [...new Set(childRows.map((r) => r.subject))].sort();
  let subY = summaryY + 6;
  subjects.forEach((subj) => {
    const subjRows = childRows.filter((r) => r.subject === subj);
    const subjAvg = Math.round((subjRows.reduce((s, r) => s + (r.total > 0 ? r.score / r.total : 0), 0) / subjRows.length) * 100);
    const barColor: [number,number,number] = subjAvg >= 80 ? [34, 197, 94] : subjAvg >= 50 ? [234, 179, 8] : [239, 68, 68];

    doc.setTextColor(55, 48, 163);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(subj, 22, subY + 4);

    // Bar background
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(70, subY, 90, 5, 1, 1, 'F');
    // Bar fill
    doc.setFillColor(...barColor);
    doc.roundedRect(70, subY, (subjAvg / 100) * 90, 5, 1, 1, 'F');

    // % label
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`${subjAvg}%`, 165, subY + 4);

    // attempts count
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(8);
    doc.text(`${subjRows.length} attempt${subjRows.length !== 1 ? 's' : ''}`, 174, subY + 4);

    subY += 9;
  });

  // ── DETAILED RESULTS TABLE ──
  const tableHeaderY = subY + 6;
  doc.setTextColor(88, 28, 135);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DETAILED ACTIVITY RESULTS', 20, tableHeaderY);

  const colX = [20, 62, 114, 145, 170];
  const colHeaders = ['Subject', 'Activity', 'Score', 'Date'];
  let tableY = tableHeaderY + 6;

  // Header row
  doc.setFillColor(237, 233, 254);
  doc.rect(20, tableY - 4, 170, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(88, 28, 135);
  colHeaders.forEach((h, i) => doc.text(h, colX[i] + 1, tableY));
  tableY += 7;

  // Data rows
  childRows.forEach((r, idx) => {
    if (tableY > 272) {
      doc.addPage();
      // Re-draw header on new page
      doc.setFillColor(109, 40, 217);
      doc.rect(0, 0, 210, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(`${displayName} — Continued`, 105, 8, { align: 'center' });
      tableY = 20;
    }

    const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
    const dateStr = new Date(r.dateTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

    if (idx % 2 === 0) {
      doc.setFillColor(253, 251, 255);
      doc.rect(20, tableY - 4, 170, 6.5, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);

    // Subject
    doc.setTextColor(88, 28, 135);
    doc.text(r.subject.slice(0, 18), colX[0] + 1, tableY);
    // Activity
    doc.setTextColor(55, 65, 81);
    doc.text(r.activity.slice(0, 22), colX[1] + 1, tableY);
    // Score with colour
    const scoreColor: [number,number,number] = pct >= 80 ? [22, 163, 74] : pct >= 50 ? [161, 98, 7] : [220, 38, 38];
    doc.setTextColor(...scoreColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`${r.score}/${r.total} (${pct}%)`, colX[2] + 1, tableY);
    // Date
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.text(dateStr, colX[3] + 1, tableY);

    tableY += 6.5;
  });

  if (childRows.length === 0) {
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(10);
    doc.text('No activity results recorded yet.', 105, tableY + 10, { align: 'center' });
  }

  // ── AI COACH NOTE ──
  const noteY = Math.min(tableY + 8, 258);
  if (noteY < 260) {
    doc.setFillColor(250, 245, 255);
    doc.roundedRect(20, noteY, 170, 14, 3, 3, 'F');
    doc.setTextColor(109, 40, 217);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('💡 AI Training Coach', 25, noteY + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(88, 28, 135);
    doc.text('Run the AI Training Coach analysis in the Parent Dashboard to generate personalised recommendations.', 25, noteY + 12, { maxWidth: 160 });
  }

  // ── FOOTER ──
  const pageCount = (doc as any).getNumberOfPages?.() ?? 1;
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFillColor(109, 40, 217);
    doc.rect(0, 284, 210, 13, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('KKZ Learning Hub — Confidential Student Progress Report', 15, 291);
    doc.text(`Page ${p} of ${pageCount}`, 185, 291, { align: 'right' });
  }

  return doc;
}

export default function ReportDownload({ rows, settings }: ReportDownloadProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadChild = async (childKey: string) => {
    setDownloading(childKey);
    try {
      const doc = buildChildPDF(childKey, rows, settings);
      const displayName = settings.children[childKey]?.name ?? childKey;
      doc.save(`KKZ_Progress_${displayName}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error('PDF generation failed', e);
    } finally {
      setDownloading(null);
    }
  };

  const downloadAll = async () => {
    setDownloading('all');
    try {
      const { jsPDF } = require('jspdf');
      const childKeys = Object.keys(settings.children);
      // Build first child's doc, then add subsequent children's pages
      let mergedDoc: any = null;
      childKeys.forEach((key) => {
        const doc = buildChildPDF(key, rows, settings);
        if (!mergedDoc) {
          mergedDoc = doc;
        } else {
          // Append pages from doc to mergedDoc
          const pageCount = (doc as any).getNumberOfPages?.() ?? 1;
          for (let p = 1; p <= pageCount; p++) {
            mergedDoc.addPage();
            // jsPDF doesn't natively merge — just save individually
          }
        }
      });
      // Save each individually since jsPDF can't easily merge
      for (const key of childKeys) {
        const doc = buildChildPDF(key, rows, settings);
        const displayName = settings.children[key]?.name ?? key;
        doc.save(`KKZ_Progress_${displayName}_${new Date().toISOString().slice(0, 10)}.pdf`);
        await new Promise((res) => setTimeout(res, 300));
      }
    } catch (e) {
      console.error('PDF generation failed', e);
    } finally {
      setDownloading(null);
    }
  };

  const childKeys = Object.keys(settings.children);

  return (
    <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-sm p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📄</span>
        <div>
          <h2 className="text-base font-extrabold text-purple-800">Progress Reports</h2>
          <p className="text-xs text-purple-400">Download printable PDF reports · suitable for teachers</p>
        </div>
        <button
          onClick={downloadAll}
          disabled={downloading !== null || rows.length === 0}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl transition-all active:scale-95 shadow-sm"
        >
          {downloading === 'all' ? (
            <><span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating…</>
          ) : (
            <>⬇️ Export All Children</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {childKeys.map((key) => {
          const child = settings.children[key];
          const childRows = rows.filter((r) => r.childName === key || r.childName === child?.name);
          const avgScore = childRows.length > 0
            ? Math.round((childRows.reduce((s, r) => s + (r.total > 0 ? r.score / r.total : 0), 0) / childRows.length) * 100)
            : null;

          return (
            <div key={key} className="flex items-center justify-between gap-3 bg-purple-50 rounded-2xl border border-purple-100 px-4 py-3">
              <div className="flex items-center gap-2">
                {child?.photoUrl ? (
                  <img src={child.photoUrl} alt={child.name} className="w-8 h-8 rounded-full object-cover border-2 border-purple-200" />
                ) : (
                  <span className="text-xl">{child?.emoji ?? '👤'}</span>
                )}
                <div>
                  <p className="text-sm font-extrabold text-purple-800">{child?.name ?? key}</p>
                  <p className="text-xs text-purple-400">
                    {childRows.length} attempt{childRows.length !== 1 ? 's' : ''}
                    {avgScore !== null ? ` · ${avgScore}% avg` : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => downloadChild(key)}
                disabled={downloading !== null}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl transition-all active:scale-95"
              >
                {downloading === key ? (
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  '⬇️'
                )}
                PDF
              </button>
            </div>
          );
        })}
      </div>

      {rows.length === 0 && (
        <p className="text-xs text-purple-300 text-center mt-3 font-medium">Complete some activities to generate a report.</p>
      )}
    </div>
  );
}
