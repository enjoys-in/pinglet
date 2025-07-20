export async function loadAllTemplates(
  endpoint,
  projectId,
  pingletId,
  checksum,
  version
) {
  const response = await fetch(
    `${endpoint}/load/templates?projectId=${projectId}`,
    {
      headers: {
        "X-Project-ID": projectId,
        "X-Timestamp": Date.now(),
        "X-Pinglet-Signature": pingletId,
        "X-Pinglet-Checksum": checksum,
        "X-Pinglet-Version": version,
      },

      credentials: "omit",
    }
  );

  const data = await response.json();

  if (!data || !data.success) {
    return null;
  }
  return data.result;
}
