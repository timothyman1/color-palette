// /app/api/hello/route.test.ts
import { testApiHandler } from "next-test-api-route-handler"; // Must always be first
import * as appHandler from "./route";

it("GET returns 200", async () => {
  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({ method: "GET" });
      const json = await response.json();
      expect(response.status).toBe(200);
      await expect(json).toStrictEqual({
        hello: true,
      });
    },
  });
});
