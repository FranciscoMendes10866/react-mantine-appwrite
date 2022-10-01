import { Client, Account, Databases } from "appwrite";

const appwriteBuilder = (endoint: string, projectId: string) => {
  const setup = () => {
    const client = new Client();
    client.setEndpoint(endoint).setProject(projectId);

    return {
      client,
      account: new Account(client),
      databases: new Databases(client),
    };
  };

  return {
    endoint,
    projectId,
    setup,
  };
};

export const appwrite = appwriteBuilder(
  "http://localhost/v1",
  "6325e3d84cc552e34c15"
).setup();
