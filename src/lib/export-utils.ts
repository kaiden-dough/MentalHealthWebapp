/**
 * Utility functions for exporting mood history data.
 * Provides CSV export functionality for user mood entries.
 */

export interface MoodEntry {
  date: string; // ISO format: YYYY-MM-DD
  time?: string; // HH:MM format
  mood: number; // 1-5 scale
  stress: number; // 1-5 scale
  notes?: string;
}

/**
 * Converts mood/stress numeric level to human-readable label
 * @param level - Numeric level (1-5)
 * @returns Label string (e.g., "Very Low", "Low", "Neutral", "High", "Very High")
 */
export function moodLevelToLabel(level: number): string {
  const labels = {
    1: 'Very Low',
    2: 'Low',
    3: 'Neutral',
    4: 'High',
    5: 'Very High',
  };
  return labels[level as keyof typeof labels] || 'Unknown';
}

/**
 * Escapes CSV special characters in a string
 * @param value - String value to escape
 * @returns Escaped string safe for CSV format
 */
function escapeCSVValue(value: string | undefined): string {
  if (!value) return '';
  const str = String(value);
  // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates a filename for the export with current date
 * @returns Filename string (e.g., "mood-export-2026-04-24.csv")
 */
export function generateExportFilename(): string {
  const date = new Date().toISOString().split('T')[0];
  return `mood-export-${date}.csv`;
}

/**
 * Converts mood entries to CSV format
 * @param entries - Array of mood entries to export
 * @returns CSV-formatted string with headers and data rows
 */
export function convertToCSV(entries: MoodEntry[]): string {
  if (entries.length === 0) {
    return 'Date,Time,Mood,Stress,Notes\n';
  }

  const headers = ['Date', 'Time', 'Mood', 'Stress Level', 'Notes'];
  const csvHeader = headers.join(',') + '\n';

  const csvRows = entries
    .map((entry) => {
      const date = escapeCSVValue(entry.date);
      const time = escapeCSVValue(entry.time || '');
      const mood = moodLevelToLabel(entry.mood);
      const stress = moodLevelToLabel(entry.stress);
      const notes = escapeCSVValue(entry.notes);

      return [date, time, mood, stress, notes].join(',');
    })
    .join('\n');

  return csvHeader + csvRows;
}

/**
 * Triggers a browser download of CSV data
 * @param csvContent - CSV-formatted string content
 * @param filename - Name for the downloaded file
 */
export function downloadCSV(csvContent: string, filename: string = generateExportFilename()): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Main export function: converts entries to CSV and triggers download
 * @param entries - Array of mood entries to export
 * @param filename - Optional custom filename (defaults to generated name with date)
 */
export function exportMoodHistoryAsCSV(entries: MoodEntry[], filename?: string): void {
  if (entries.length === 0) {
    console.warn('No mood entries to export');
    return;
  }

  const csvContent = convertToCSV(entries);
  const exportFilename = filename || generateExportFilename();
  downloadCSV(csvContent, exportFilename);
}
