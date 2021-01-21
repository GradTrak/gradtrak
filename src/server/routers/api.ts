import express from 'express';
import passport from 'passport';

import { cache } from '../config/cache';

import * as courseController from '../controllers/courseController';
import * as requirementController from '../controllers/requirementController';
import * as tagController from '../controllers/tagController';
import * as userController from '../controllers/userController';

export const api = express.Router();

api.get('/courses', cache.route(), courseController.getCourses);
api.get('/requirements', cache.route(), requirementController.getRequirements);
api.get('/tags', cache.route(), tagController.getTags);

api.get('/user', userController.getUserData);
api.put('/user', userController.setUserData);

api.post('/account/register', userController.register);
api.post(
  '/account/login',
  passport.authenticate('local', { failWithError: true }),
  userController.loginSuccessLocal,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (req: express.Request, res: express.Response) => {
    res.status(200);
    userController.loginFailure(req, res);
  },
);
api.get(
  '/account/login/google/callback',
  passport.authenticate('google'),
  userController.loginSuccessGoogle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (req: express.Request, res: express.Response) => {
    res.status(200);
    userController.loginFailure(req, res);
  },
);
api.post('/account/logout', userController.logout);
api.get('/account/whoami', userController.whoami);
api.post('/account/password', userController.changePassword);
