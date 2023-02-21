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
      'initiative_id',
      'responsible_id',
      'responsible',
      'Responsible',
      'unit_id',
      'unit',
      'perspective_id',
      'perspective',
      'stage_id',
      'stage',
      'font_id',
      'font',
      'goal_id',
      'goal',
      'mapp_id',
      'mapp',
      'totalValue',
      'executed',
      'totalActivities',
      'comments',
      'created_at',
      'updated_at',
    ],
  },
  {
    modelName: 'activity',
    fields: [
      'id',
      'name',
      'responsible_id',
      'responsible',
      'Responsible',
      'date_start',
      'date_end',
      'state_id',
      'state',
      'initiative_id',
      'initiative',
      'file',
      'value',
      'comments',
      'created_at',
      'updated_at',
    ],
  },
];

viewsData.forEach(({ modelName, fields }) => {
  router.use((request, response, next) => {
    viewCreator({ request, response, next, modelName, fields });
  });
});

export default router;
