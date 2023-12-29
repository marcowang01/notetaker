'use server'

import { ClientSecretCredential } from "@azure/identity";
import { CosmosClient, Container } from "@azure/cosmos";
import { Note } from "@/types/notes";

const key = process.env.COSMOS_KEY || "<cosmos key>";
const endpoint = process.env.COSMOS_ENDPOINT || "<cosmos endpoint>";
const containerId = process.env.COSMOS_CONTAINER || "<cosmos container>";
const databaseId = process.env.COSMOS_DATABASE || "<cosmos database>";


function getClient(useAAD: boolean = false): CosmosClient {
  if (useAAD) {
    const tenantId = process.env.AZURE_TEANANT_ID;
    const clientId = process.env.AZURE_CLIENT_ID;
    const clientSecret = process.env.AZURE_CLIENT_SECRET;

    if (!tenantId || !clientId || !clientSecret) {
      throw new Error("Azure AD credentials are not properly configured.");
    }

    const credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);

    return new CosmosClient({
      endpoint,
      aadCredentials: credentials,
    });
  } else {
    if (!key) {
      throw new Error("Cosmos DB key is not set in environment variables.");
    }

    return new CosmosClient({
      endpoint,
      key: key,
    });
  }
}


function getContainer(): Container {
  const client = getClient();

  const database = client.database(databaseId);
  return database.container(containerId);
}

export async function createItem(item: Note) {
  const container = getContainer();

  try {
    const { resource, statusCode } = await container.items.create(item);

    if (statusCode === 201 && resource) {
      console.log("Created item successfully:", resource.id);
      return resource.title;
    } else {
      throw new Error(`Failed to create item, status code: ${statusCode}`);
    }
  } catch (error) {
    throw new Error(`Error creating item: ${error}`);
  }
}


export async function getItemsByUser(userId: string): Promise<Note[]> {
  if (!userId) {
    throw new Error("User ID is required to query items.");
  }

  const container = getContainer();
  const querySpec = {
    query: "SELECT * from c where c.userId=@userId",
    parameters: [{ name: "@userId", value: userId }],
  };

  try {
    const { resources } = await container.items.query(querySpec).fetchAll();

    if (!resources) {
      throw new Error("No items found for the specified user.");
    }

    return resources.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      created: item.created,
      tags: item.tags,
      userId: item.userId,
    }));
  } catch (error) {
    throw new Error(`Error retrieving items: ${error}`);
  }
}


export async function deleteItem(id: string, userId: string) {
  if (!id || !userId) {
    throw new Error("Both item ID and user ID are required for deletion.");
  }

  const container = getContainer();

  try {
    const { statusCode } = await container.item(id, userId).delete();

    if (statusCode === 204) {
      console.log("Item deleted successfully:", id);
      return id;
    } else {
      throw new Error(`Failed to delete item, status code: ${statusCode}`);
    }
  } catch (error) {
    throw new Error(`Error deleting item: ${error}`);
  }
}



// TODO: query items by tag
// TODO: query items by recency and load more on scroll
// TODO: create/delete multiple items at once
// TODO: ability to edit items

// nodejs samples:https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cosmosdb/cosmos/samples-dev
// nodejs quickstart: https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/quickstart-nodejs?tabs=azure-portal%2Cpasswordless%2Cwindows%2Csign-in-azure-cli#authenticate-the-client
