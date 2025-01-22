import { Compose } from "@composehq/sdk";

import { database } from "../database";

/**
 * Initialize a new session and redirect to the home page. This is only necessary
 * since we use a fake in-memory database to power the demo.
 */
export default new Compose.App({
  name: "Internal Dashboard Demo",
  route: "internal-dashboard-demo",
  handler: async ({ page }) => {
    const session = database.initializeSession();

    page.link("internal-dashboard-demo-home", {
      params: {
        sessionId: session.id,
      },
    });
  },
});
