import { Router } from 'express';

import viewCreator, { ViewData } from './view';

const router = Router();
const viewsData: ViewData[] = [
  {
    modelName: 'role',
    fields: ['id', 'name'],
  },
  {
    modelName: 'user',
    fields: ['id', 'name', 'email', 'role_id', 'institution_id'],
  },
];

viewsData.forEach(({ modelName, fields }) => {
  router.use((request, response, next) => {
    viewCreator({ request, response, next, modelName, fields });
  });
});

export default router;
