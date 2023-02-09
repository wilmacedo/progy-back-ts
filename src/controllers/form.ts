import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { ErrorType } from '../types';

// TODO: Add validation on fields
export class FormController {
  async create(request: Request, response: Response) {
    const fields = [
      'institutionName',
      'institutionCode',
      'planningName',
      'perspectives',
      'stages',
      'units',
      'fonts',
      'goals',
      'states',
    ];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.form.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const { institutionName, institutionCode, planningName } = request.body;

    try {
      let institution = await prisma.institution.findFirst({
        where: { code: institutionCode },
      });
      if (!institution) {
        institution = await prisma.institution.create({
          data: { name: institutionName, code: institutionCode },
        });
      }

      const planning = await prisma.planning.create({
        data: {
          name: planningName,
          sector: '',
          Perspective: {
            create: request.body.perspectives,
          },
          Stage: {
            create: request.body.stages,
          },
          Unit: {
            create: request.body.units,
          },
          Font: {
            create: request.body.fonts,
          },
          Goals: {
            create: request.body.goals,
          },
          State: {
            create: request.body.states,
          },
        },
      });

      response.status(200).json({ data: planning });
    } catch (e) {
      response.form.error(e);
    }
  }
}
