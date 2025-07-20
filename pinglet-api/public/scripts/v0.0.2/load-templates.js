export async function loadAllTemplates(endpoint, projectId) {
  const response = await fetch(
    `${endpoint}/load/templates?projectId=${projectId}`
  );

  const data = await response.json();

  if (!data || !data.success) {
    return null;
  }
  return data.result;
}
