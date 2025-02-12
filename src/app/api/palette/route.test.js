import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "./route";

it(
  "GET returns 200",
  async () => {
    await testApiHandler({
      appHandler,
      url: "/api/palette?text=give%20me%20a%20stanley%20kubrick%20movie%20color%20palette&movie=",
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "GET",
        });
        const json = await res.json();
        const values = JSON.parse(json.replace(/'/g, '"'));

        expect(res.status).toBe(200);
        expect(typeof json).toBe("string");
        expect(values instanceof Array).toBe(true);
      },
    });
  },
  30 * 1000,
);
