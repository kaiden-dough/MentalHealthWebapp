'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download } from 'lucide-react';
import { exportMoodHistoryAsCSV, type MoodEntry } from '@/lib/export-utils';

interface ExportButtonProps {
  moodEntries: MoodEntry[];
  disabled?: boolean;
}

/**
 * ExportButton Component
 * 
 * Provides a dropdown menu for exporting mood history in various formats.
 * Currently supports CSV export; extensible for JSON, PDF, and Excel formats.
 * 
 * @example
 * ```tsx
 * import { ExportButton } from '@/components/export-button';
 * 
 * export function TrendsPage() {
 *   const [moodData, setMoodData] = useState<MoodEntry[]>([]);
 *   
 *   return <ExportButton moodEntries={moodData} />;
 * }
 * ```
 */
export function ExportButton({ moodEntries, disabled = false }: ExportButtonProps) {
  const isDisabled = disabled || moodEntries.length === 0;

  const handleExportCSV = () => {
    try {
      exportMoodHistoryAsCSV(moodEntries);
    } catch (error) {
      console.error('Failed to export CSV:', error);
      // TODO: Show error toast notification via sonner
    }
  };

  const handleExportJSON = () => {
    try {
      const jsonContent = JSON.stringify(moodEntries, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('href', url);
      link.setAttribute('download', `mood-export-${date}.json`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export JSON:', error);
      // TODO: Show error toast notification via sonner
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isDisabled}
          className="gap-2"
          aria-label="Export mood history in different formats"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV} disabled={isDisabled}>
          <span>CSV (Spreadsheet)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON} disabled={isDisabled}>
          <span>JSON (Data)</span>
        </DropdownMenuItem>
        {/* Future: PDF and Excel export options
        <DropdownMenuItem onClick={handleExportPDF} disabled={isDisabled}>
          <span>PDF (Report)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel} disabled={isDisabled}>
          <span>Excel (Workbook)</span>
        </DropdownMenuItem>
        */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
