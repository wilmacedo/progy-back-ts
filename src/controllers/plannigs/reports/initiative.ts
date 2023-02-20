import { Request, Response } from 'express';
import { Content } from 'pdfmake/interfaces';
import { prisma } from '../../../database/client';
import { ErrorType } from '../../../types/index';
import { Report } from './index';

export class InitiativeReportController {
  async generate(request: Request, response: Response) {
    const { unit } = request.body;
    if (!unit) {
      response.initiative.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const initiatives = await prisma.initiative.findMany({
      where: { unit_id: unit },
      include: {
        stage: { select: { name: true } },
        font: { select: { name: true } },
        unit: { select: { name: true } },
        responsible: { select: { name: true } },
      },
    });
    if (initiatives.length === 0) {
      response.initiative.error({ type: ErrorType.EMPTY });
      return;
    }

    const unitName = initiatives[0].unit?.name || 'N/A';
    const report = new Report('Iniciativas', unitName);

    const rows: Content[] = [];
    for (const initiative of initiatives) {
      const activities = await prisma.activity.findMany({
        where: { initiative_id: initiative.id },
        include: {
          state: { select: { name: true } },
        },
      });

      let totalValue = 0;
      if (activities.length > 0) {
        activities.forEach(activity => (totalValue += Number(activity.value)));
      }

      let dones = 0;
      if (activities.length > 0) {
        activities.forEach(activity => {
          if (activity.state?.name === 'Concluído') dones++;
        });
      }

      let executed: string | number = (dones / activities.length) * 100;
      if (executed % 1 !== 0) executed = executed.toFixed(1);

      let responsible = initiative.responsible?.name;
      if (!responsible) (responsible as any) = initiative.responsible;

      rows.push([
        '\n',
        {
          table: {
            body: [
              report.generateHeaders([
                'Código MAPP',
                'Iniciativa',
                '% das Atividades Executadas',
                'Total de Atividades',
                'Responsável',
                'Estágio',
                'Fonte',
                'Valor Total',
              ]),
              [
                { text: initiative.code, style: 'tableItem' },
                { text: initiative.name, style: 'tableItem' },
                { text: `${executed}%`, style: 'tableItem' },
                { text: activities.length, style: 'tableItem' },
                { text: responsible, style: 'tableItem' },
                { text: initiative.stage?.name, style: 'tableItem' },
                { text: initiative.font?.name, style: 'tableItem' },
                {
                  text: (Number(totalValue) || 0).toLocaleString('pt-br', {
                    style: 'currency',
                    currency: 'BRL',
                  }),
                  style: 'tableItemCenter',
                },
              ],
            ],
          },
        },
        '\n',
        [
          { text: 'Observação: ' },
          { text: initiative.comments || 'Nenhum comentário', italics: true },
        ],
        '\n',
      ]);
    }

    report.createBody = async () => rows;

    return report.generate(response);
  }
}
