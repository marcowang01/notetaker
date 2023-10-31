import { Deepgram } from "@deepgram/sdk";
const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY || "");

const getProjectId = async () => {
  const result = await deepgram.projects.list();

  if (result.err_msg) {
    throw new Error(result.err_msg);
  }

  return result.projects[0].project_id;
};

const getTempApiKey = async (projectId: string) => {
  const scopes = ["member", "onprem:products"];
  const comment = "temp key for testing";
  const result = await deepgram.keys.create(projectId, comment, scopes);

  if (result.err_msg) {
    throw new Error(result.err_msg);
  }

  return result;
};


export async function GET(req: Request) {
  const projectId = await getProjectId();
  const result = await getTempApiKey(projectId);

  return Response.json(result);
}