import type { EngravingProject } from '../types';

export async function exportToExcel(project: EngravingProject): Promise<void> {
  const { utils, writeFile } = await import('xlsx');

  const rows: unknown[][] = [
    ['Project', 'Client', 'Project Code', 'Prepared By', 'Date', 'Revision', 'Status'],
    [project.name, project.client, project.projectCode, project.preparedBy, project.date, project.revision, project.status],
    [],
    ['Room', 'Keypad', 'Location', 'Brand', 'Model', 'Button Count', 'Button No', 'Label', 'Action Type', 'Notes'],
  ];

  for (const room of project.rooms) {
    for (const kp of room.keypads) {
      for (const btn of kp.buttons) {
        rows.push([
          room.name,
          kp.name,
          kp.location,
          kp.brand,
          kp.model,
          kp.buttonCount,
          btn.position,
          btn.label,
          btn.actionType,
          btn.notes,
        ]);
      }
    }
  }

  const ws = utils.aoa_to_sheet(rows);
  ws['!cols'] = [
    { wch: 20 }, { wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
    { wch: 6 }, { wch: 8 }, { wch: 18 }, { wch: 12 }, { wch: 30 },
  ];

  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Engraving Layout');
  writeFile(wb, `${project.projectCode || project.name}_Engraving_R${project.revision}.xlsx`);
}
