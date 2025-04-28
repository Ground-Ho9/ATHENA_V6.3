// utils/breadcrumbs.js
const MAX_BREADCRUMBS = 10;
let breadcrumbs = [];

export const addBreadcrumb = (event) => {
  const entry = {
    event,
    timestamp: new Date().toISOString()
  };
  breadcrumbs.push(entry);
  if (breadcrumbs.length > MAX_BREADCRUMBS) {
    breadcrumbs.shift();
  }
};

export const getBreadcrumbs = () => {
  return [...breadcrumbs];
};