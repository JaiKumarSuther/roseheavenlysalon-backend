import * as service from './docs.service.js';

export async function renderDocs(req, res) {
  const endpoints = service.getEndpoints();
  res.render('docs', { endpoints });
}

export async function renderModulesIndex(req, res) {
  const modules = service.getModules();
  res.render('modules', { modules });
}


