import { Router } from 'express';

import viewCreator, { ViewData } from './view';

const router = Router();
const viewsData: ViewData[] = [
  {
    modelName: 'user',
    fields: [
      'id',
      'name',
      'email',
      'role_id',
      'institution_id',
      'institution',
      'role',
    ],
  },
  {
    modelName: 'role',
    fields: ['id', 'name'],
  },
  {
    modelName: 'institution',
    fields: ['id', 'name', 'code'],
  },
  {
    modelName: 'goal',
    fields: ['id', 'name'],
  },
  {
    modelName: 'planning',
    fields: ['id', 'name', 'institution_id', 'institution'],
  },
  { modelName: 'form', fields: [] },
  { modelName: 'stage', fields: ['id', 'name'] },
  { modelName: 'state', fields: ['id', 'name'] },
  { modelName: 'perspective', fields: ['id', 'name'] },
  { modelName: 'unit', fields: ['id', 'name', 'code'] },
  { modelName: 'mapp', fields: ['id', 'name'] },
  {
    modelName: 'font',
    fields: ['id', 'name', 'code', 'date', 'value', 'other_value'],
  },
  {
    modelName: 'initiative',
    fields: [
      'id',
      'name',
      'code',
      'budget_code',
      'responsible_id',
      'responsible',
      'unit_id',
      'unit',
      'perspective_id',
      'perspective',
      'stage_id',
      'stage',
      'font_id',
      'goal_id',
      'goal',
      'goal_id',
      'mapp_id',
      'mapp',
      'totalValue',
      'executed',
      'totalActivities',
    ],
  },
];

viewsData.forEach(({ modelName, fields }) => {
  router.use((request, response, next) => {
    viewCreator({ request, response, next, modelName, fields });
  });
});

export default router;
