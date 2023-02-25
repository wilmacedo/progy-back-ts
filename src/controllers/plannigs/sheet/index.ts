import Excel, { Worksheet } from 'exceljs';
import { Request, Response } from 'express';
import { prisma } from '../../../database/client';
import { ErrorType } from '../../../types';
import { rowNames } from './mocks';

const generateHeader = (worksheet: Worksheet, title: string) => {
  const initialLine = 1;
  worksheet.mergeCells(initialLine, 1, initialLine, rowNames.length);

  const row = worksheet.getRow(initialLine);
  const cell = row.getCell(initialLine);
  cell.value = title;
  cell.alignment = { horizontal: 'center' };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    bgColor: { argb: '#ffcccccc' },
  };

  rowNames.forEach((name, index) => {
    const r = worksheet.getRow(initialLine + 1);
    const c = r.getCell(index + 1);
    c.value = name;
    c.alignment = { horizontal: 'center' };
  });
};

export class SheetController {
  async generate(request: Request, response: Response) {
    const { table } = request.params;
    const { unit } = request.body;
    if (!unit || !table) {
      response.planning.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const unit_id = Number(unit);

    try {
      const initiatives = await prisma.initiative.findMany({
        where: { unit_id },
        include: {
          stage: { select: { name: true } },
          font: { select: { name: true } },
          unit: { select: { name: true } },
          Responsible: { select: { name: true } },
        },
      });

      const initiativeIds = initiatives.map(initiative => initiative.id);
      const activities = await prisma.activity.findMany({
        where: { initiative_id: { in: initiativeIds } },
        include: {
          state: { select: { name: true } },
        },
      });

      const result = initiatives.map(initiative => {
        const filteredActivities = activities.filter(
          activity => activity.initiative_id === initiative.id,
        );

        let totalValue = 0;
        if (filteredActivities.length > 0) {
          filteredActivities.forEach(activity => {
            totalValue += Number(activity.value);
          });
        }

        let dones = 0;
        if (filteredActivities.length > 0) {
          filteredActivities.forEach(activity => {
            if (activity.state?.name === 'Concluído') {
              dones++;
            }
          });
        }

        const response = {
          ...initiative,
          totalValue,
          executed: dones / filteredActivities.length,
          totalActivities: filteredActivities.length,
        };

        return response;
      });

      const title = `INICIATIVAS - ${initiatives[0].unit?.name}`;
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet(title);

      generateHeader(worksheet, title);

      result.forEach((initiative, index) => {
        let percent = (initiative.executed || 0) * 100;
        if (percent % 1 === 0) {
          percent = Number(percent.toFixed(1));
        }

        let responsible = initiative.Responsible?.name;
        if (!responsible) (responsible as any) = initiative.responsible;

        const values = [
          initiative.name,
          initiative.totalActivities,
          `${percent}%`,
          initiative.code,
          responsible,
          initiative.unit?.name,
          initiative.stage?.name,
          initiative.font?.name,
          `R$${initiative.totalValue}`,
        ];

        values.forEach((value, valueIndex) => {
          const row = worksheet.getRow(index + 3);
          const cell = row.getCell(valueIndex + 1);
          cell.value = value;
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();

      response
        .contentType(
          'application/vnd.openxmlformats-officedocument.spreadsheet.sheet',
        )
        .send(buffer);
    } catch (e) {
      response.planning.error(e);
    }
  }
}
