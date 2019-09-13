import { Router } from 'express';

export default ({ a }) =>
  Router()
    .get(`/nav-items`, async (req, res) => res.send((await a('getAdminNavItems', { navItems: [], req })).navItems))
    .get(`/scripts`, async (req, res) => res.send((await a('getAdminScripts', { scripts: [] })).scripts))
    .get('*', async (req, res) => res.status(404).end())
  ;