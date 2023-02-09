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
];

viewsData.forEach(({ modelName, fields }) => {
  router.use((request, response, next) => {
    viewCreator({ request, response, next, modelName, fields });
  });
});

export default router;
