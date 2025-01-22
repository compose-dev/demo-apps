import { Compose } from "@composehq/sdk";
import { dashboard, router } from "./apps";

/**
 * Initialize the Compose client.
 * 
 * Get a free API key: https://app.composehq.com/auth/signup
 */
const client = new Compose.Client({
  apiKey: "YOUR_API_KEY", // Replace with your API key
  apps: [dashboard, router],
});

client.connect();