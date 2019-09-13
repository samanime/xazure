import { Router } from 'express';

export default ({ a }) => {
  return Router()
    .get(`/scripts`, async (req, res) => res.send((await a('getScripts', { scripts: [], req })).scripts))
    .get(`/routes`, async (req, res) => res.send((await a('getRoutes', { routes: {} })).routes))
    .get(`/menu/:name?`, async (req, res) =>
      res.send((await a('getMenu', { menuItems: [], name: req.params.name, req })).menuItems))
    .get('*', async (req, res) => res.status(404).end())
  ;
}