import express from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/leadController';
import { protect } from '../middlewares/auth';
import { authorize } from '../middlewares/role';

const router = express.Router();

router.use(protect); // All lead routes are protected

router.get('/export/csv', authorize('Admin'), exportLeadsCSV);

router.route('/')
  .get(getLeads)
  .post(createLead);

router.route('/:id')
  .get(getLead)
  .put(updateLead)
  .delete(authorize('Admin'), deleteLead);

export default router;
