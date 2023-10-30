const { createClient } = require("@deepgram/sdk");
const client = createClient(process.env.DEEPGRAM_API_KEY);

const getProjectId = async () => {
  const { result, error } = await client.manage.getProjects();

  if (error) {
    throw error;
  }

  return result.projects[0].project_id;
};

const getTempApiKey = async (projectId: string) => {
  const { result, error } = await client.manage.createProjectKey(projectId, {
    comment: "short lived",
    scopes: ["usage:write"],
    time_to_live_in_seconds: 20,
  });

  if (error) {
    throw error;
  }

  return result;
};


export async function GET(req: Request) {
  const projectId = await getProjectId();
  const key = await getTempApiKey(projectId);

  return Response.json({ key });
}