import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { prisma } from '../database/client';

const getPlanning = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const planning_id = request.params.planning_id;
  if (!planning_id) {
    response.status(400).json({ error: 'Missing planning id field' });
    return;
  }
  const id = Number(planning_id);
  if (isNaN(id)) {
    response.status(400).json({ error: 'Invalid planning id field' });
    return;
  }

  try {
    const planning = await prisma.planning.findUnique({ where: { id } });
    if (!planning) {
      response.status(404).json({ error: 'Planning not found' });
      return;
    }

    request.planning_id = id;
    next();
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      response.status(400).json({ error: 'Planning not found' });
    }
  }
};

export { getPlanning };
