import { Activity } from '@prisma/client';
import { isValid } from 'date-fns';
import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { ErrorType } from '../types';

const calculateIDP = (activities: Activity[]) => {
  activities = activities.filter(activity => {
    const date = activity.date_end;

    if (isValid(date)) {
      return date.getFullYear() <= new Date().getFullYear();
    }
  });

  const dones = activities.filter(
    activity => (activity as any).state.name === 'Concluído',
  );
  const pendings = activities.filter(
    activity => (activity as any).state?.name !== 'Concluído',
  );

  return [dones.length, pendings.length];
};

const delayedActivites = (activities: Activity[]) => {
  return activities.filter(activity => {
    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date().getTime();
    const date = new Date(activity.date_end).getTime();

    const doneDate = Math.round((date - today) / oneDay);
    const doneStates = ['Concluído', 'Suspenso'];

    if (doneDate < 0 && !doneStates.includes((activity as any).state.name)) {
      return activity;
    }
  });
};

const calculateTotals = (activities: Activity[]) => {
  let cost = activities
    .map(activity => Number(activity.value))
    .reduce((acc, curr) => acc + curr, 0);

  const done = activities
    .filter(activity => (activity as any).state.name === 'Concluído')
    .map(activity => Number(activity.value))
    .reduce((acc, curr) => acc + curr, 0);

  if (cost === 0 && done === 0) cost = 1;

  return [cost, done];
};

export const info = async (request: Request, response: Response) => {
  const { planning_id } = request;
  if (!planning_id) {
    response.user.error({ type: ErrorType.NOT_FOUND_PLANNING });
    return;
  }

  const planning = await prisma.planning.findUnique({
    where: { id: planning_id },
  });
  if (!planning_id) {
    response.user.error({ type: ErrorType.NOT_FOUND_PLANNING });
    return;
  }

  try {
    const stages = await prisma.stage.findMany({ where: { planning_id } });
    const options = { include: { stage: { select: { name: true } } } };
    if (request.userData.unit_id) {
      (options as any).where = { unit_id: request.userData.unit_id };
    }

    const initiatives = await prisma.initiative.findMany(options);
    const dones = initiatives.filter(
      initiative => initiative.stage?.name === 'Concluído',
    );

    const stagesPerInitiative = stages.map(stage => {
      const filteredStages = initiatives.filter(
        initiative => initiative.stage_id === stage.id,
      );

      return {
        percentage: (filteredStages.length / initiatives.length) * 100,
        value: filteredStages.length,
        title: stage.name,
        id: stage.id,
      };
    });

    const states = await prisma.state.findMany({ where: { planning_id } });
    let activities = await prisma.activity.findMany({
      include: {
        state: { select: { name: true } },
        initiative: { select: { unit_id: true } },
      },
    });
    if (request.userData.unit_id) {
      activities = activities.filter(
        activity => activity.initiative?.unit_id === request.userData.unit_id,
      );
    }

    const statusPerActivity = states.map(state => {
      const filteredActivities = activities.filter(
        activity => activity.state_id === state.id,
      );

      return {
        percentage: (filteredActivities.length / activities.length) * 100,
        value: filteredActivities.length,
        title: state.name,
        id: state.id,
      };
    });

    const delayed = delayedActivites(activities);
    const idp = calculateIDP(activities);
    const totalGoals = await prisma.goal.count({ where: { planning_id } });

    response.status(200).json({
      data: {
        title: planning?.name,
        stagesPerInitiative,
        statusPerActivity,
        costIndicator: calculateTotals(activities),
        idp,
        totalGoals,
        totalDelayed: delayed.length,
        totalInitiatives: initiatives.length,
        totalInitiativesDone: dones.length,
      },
    });
  } catch (e) {
    response.status(500).json({ error: e });
  }
};
