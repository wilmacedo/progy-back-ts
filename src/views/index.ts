import { Router } from 'express';

import viewCreator, { ViewData } from './view';

const router = Router();
const viewsData: ViewData[] = [
  {
    modelName: 'user',
    fields: ['id', 'name', 'email', 'role_id', 'institution_id'],
  },
  {
    modelName: 'role',
    fields: ['id', 'name'],
  },
  {
    modelName: 'institution',
    fields: ['id', 'name', 'code'],
  },
];

viewsData.forEach(({ modelName, fields }) => {
  router.use((request, response, next) => {
    viewCreator({ request, response, next, modelName, fields });
  });
});

export default router;
