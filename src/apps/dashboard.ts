import { Compose } from "@composehq/sdk";

import { database } from "../database";

/**
 * The home page for the internal dashboard demo.
 */
export default new Compose.App({
  name: "Internal Dashboard Demo / Home",
  parentAppRoute: "internal-dashboard-demo",
  route: "internal-dashboard-demo-home",
  handler: async ({ page, ui }) => {
    const sessionId = page.params.sessionId;

    // If the session ID is not provided, redirect to the router.
    if (!sessionId || typeof sessionId !== "string") {
      page.link("internal-dashboard-demo");
      return;
    }

    const db = database.initializeSession(sessionId);

    page.add(() =>
      ui.distributedRow([
        ui.image("https://composehq.com/dark-logo-with-text.svg", {
          style: { width: "200px" },
        }),
        ui.header("Admin Portal", { color: "primary" }),
      ])
    );

    page.add(() =>
      ui.card([
        ui.distributedRow([
          ui.text(
            "This is a demo app that shows how easy it is to build custom internal tools with Compose. You can run this app yourself in less than 5 minutes.",
            {
              style: {
                maxWidth: "50rem",
              },
            }
          ),
          ui.button("View source code", {
            onClick: () => {
              page.link("https://github.com/compose-dev/demo-apps", {
                newTab: true,
              });
            },
          }),
        ]),
      ])
    );

    page.add(() =>
      ui.table("companies", db.companies, {
        label: "Companies",
        columns: [
          "name",
          {
            key: "tier",
            format: "tag",
            tagColors: {
              pink: "basic",
              blue: "premium",
              orange: "enterprise",
            },
          },
          {
            key: "arr",
            format: "currency",
            label: "ARR",
          },
          "createdAt",
        ],
        actions: [
          {
            label: "Edit",
            onClick: (row) => {
              page.modal(
                ({ resolve }) =>
                  ui.form(
                    "edit-user",
                    [
                      ui.textInput("name", { initialValue: row.name }),
                      ui.numberInput("arr", {
                        initialValue: row.arr,
                        label: "ARR",
                      }),
                      ui.radioGroup(
                        "tier",
                        ["basic", "premium", "enterprise"],
                        {
                          initialValue: row.tier,
                        }
                      ),
                    ],
                    {
                      onSubmit: (formData) => {
                        db.editCompany(row.id, formData);
                        page.toast("Company updated", {
                          appearance: "success",
                        });
                        page.update();
                        resolve(); // Close the modal
                      },
                    }
                  ),
                {
                  title: "Edit Company",
                }
              );
            },
            surface: true,
          },
          {
            label: "Delete",
            onClick: async (row) => {
              const confirmed = await page.confirm({
                title: "Delete company",
                message: "Are you sure you want to delete this company?",
                appearance: "danger",
                typeToConfirmText: row.name,
              });

              if (confirmed) {
                db.deleteCompany(row.id);
                page.toast("Company deleted", { appearance: "success" });
                page.update();
              } else {
                page.toast("Company not deleted", { appearance: "warning" });
              }
            },
            surface: true,
          },
        ],
        style: {
          height: "40rem",
        },
        allowSelect: false,
      })
    );

    page.add(() =>
      ui.row([
        ui.barChart("monthly-arr", db.companies, {
          label: "Monthly ARR",
          group: (row) =>
            row.createdAt.toLocaleDateString("en-US", {
              month: "short",
            }),
          series: [
            {
              label: "Revenue",
              value: (row) => row.arr,
            },
          ],
        }),
      ])
    );
  },
});
