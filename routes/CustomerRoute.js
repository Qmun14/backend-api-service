import express from 'express';
import { getCustomers } from '../controller/Customers.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/customers', verifyUser, getCustomers);

export default router;