import express from 'express';
import { getMembers } from '../controller/Members.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/members', verifyUser, getMembers);

export default router;