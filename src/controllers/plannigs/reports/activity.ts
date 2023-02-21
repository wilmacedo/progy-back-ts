import { Request, Response } from 'express';
import { Content, TableCell } from 'pdfmake/interfaces';
import { Report } from '.';
import { prisma } from '../../../database/client';
import { ErrorType } from '../../../types';
import { formatDate } from '../../../utils';

export class InitiativeReportController {
  async generate(request: Request, response: Response) {
    const { unit, goal, delayed, period } = request.body;

    if ((unit && isNaN(unit)) || (goal && isNaN(goal))) {
      response.initiative.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const modelId = unit || goal;

    const model = await (prisma[unit ? 'unit' : 'goal'] as any).findUnique({
      where: { id: modelId },
    });
    if (!model) {
      response[unit ? 'unit' : 'goal'].error({ type: ErrorType.NOT_FOUND });
      return;
    }

    const modelName = `
      ${model.name.substring(0, 45)}${model.name.length > 45 && '...'}`;

    const report = new Report('Atividades', modelName);
    const headers: Content = [];

    headers.push({
      text: [`Relatório das ${report.name}`, '\n\n'],
      style: 'header',
      alignment: 'center',
    });

    if (delayed) {
      headers.push([
        { text: 'Atividades Atrasadas', bold: true, italics: true },
        '\n',
      ]);
    }

    headers.push([
      {
        text: `${unit ? 'Unidade' : 'Objetivo'}: ${report.filterName}`,
        alignment: 'center',
      },
    ]);

    report.createHeader = () => headers;

    const initiatives = await prisma.initiative.findMany({
      where: { [unit ? 'unit_id' : 'goal_id']: modelId },
      include: { unit: { select: { name: true } } },
    });
    if (initiatives.length === 0) {
      response.initiative.error({ type: ErrorType.EMPTY });
      return;
    }

    const tables: Content = [];
    const sortedInitiatives = initiatives.sort((acc, initiative) => {
      const accCode = acc.code.toUpperCase();
      const initiativeCode = initiative.code.toUpperCase();

      if (accCode < initiativeCode) return -1;
      if (accCode > initiativeCode) return 1;

      return 0;
    });

    for (const initiative of sortedInitiatives) {
      const rows: TableCell[][] = [];
      const activities = await prisma.activity.findMany({
        where: { initiative_id: initiative.id },
        include: {
          state: { select: { name: true } },
          Responsible: { select: { name: true } },
        },
      });

      if (activities.length > 0) {
        let sortedActivities = activities.sort(
          (acc, activity) =>
            new Date(acc.date_start).getTime() -
            new Date(activity.date_start).getTime(),
        );

        if (delayed) {
          const delayed = sortedActivities.filter(activity => {
            const oneDay = 24 * 60 * 60 * 1000;
            const today = new Date().getTime();
            const date = new Date(activity.date_end).getTime();

            const doneDate = Math.round((date - today) / oneDay);
            const doneStates = ['Concluído', 'Suspenso', 'Cancelado'];

            if (doneDate < 0 && !doneStates.includes(activity.state.name)) {
              return activity;
            }
          });

          sortedActivities = delayed;
        }

        if (sortedActivities.length <= 0 && delayed) {
          return [];
        }

        if (period && Array.isArray(period) && period.length === 2) {
          sortedActivities = sortedActivities.filter(activity => {
            const dateStart = new Date(activity.date_start);
            const periodStart = new Date(period[0]);

            const dateEnd = new Date(activity.date_end);
            const periodEnd = new Date(period[1]);

            return dateStart >= periodStart && dateEnd <= periodEnd;
          });
        }

        sortedActivities.forEach(activity => {
          const responsible =
            activity.Responsible?.name || activity.responsible;
          const dateStart = formatDate(new Date(activity.date_start));
          const dateEnd = formatDate(new Date(activity.date_end));
          const value = Number(activity.value).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          });
          const file = activity.file ? 'Sim' : 'Não';

          rows.push([
            { text: activity.name, style: 'tableItem' },
            { text: responsible, style: 'tableItem' },
            { text: dateStart, style: 'tableItem' },
            { text: dateEnd, style: 'tableItem' },
            { text: value, style: 'tableItem' },
            { text: activity.state?.name, style: 'tableItem' },
            { text: activity.comments || 'N/A', style: 'tableItem' },
            { text: file, style: 'tableItem' },
          ]);
        });
      }

      let goalTitle: Content = [];
      if (!isNaN(goal)) {
        goalTitle = [
          {
            text: [
              { text: 'Secretaria: ', bold: true },
              `${initiative.unit.name}`,
            ],
          },
        ];
      }

      tables.push([
        '\n\n',
        ...goalTitle,
        '\n',
        { text: [{ text: 'Inciativa: ', bold: true }, `${initiative.name}`] },
        '\n',
        {
          text: [{ text: 'Código MAPP: ', bold: true }, `${initiative.code}`],
        },
        '\n',
        {
          table: {
            body: [
              [
                { text: 'Atividade', style: 'tableHeader' },
                { text: 'Responsável', style: 'tableHeader' },
                { text: 'Data Início', style: 'tableHeader' },
                { text: 'Data Término', style: 'tableHeader' },
                { text: 'Valor', style: 'tableHeader' },
                { text: 'Status', style: 'tableHeader' },
                { text: 'Observação', style: 'tableHeader' },
                { text: 'Anexo', style: 'tableHeader' },
              ],
              ...rows,
            ],
          },
        },
      ]);
    }

    report.createBody = async () => tables;

    return report.generate(response);
  }
}
