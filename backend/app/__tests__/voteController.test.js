const request = require("supertest");
const serverAddress = "http://localhost:5000";

describe("VoteController", () => {
	it("should create a vote", async () => {
		const res = await request(serverAddress).post("/api/vote").send({
			user_id: 1,
			answer_id: 1,
		});

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("id");
	});

	it("should get all votes", async () => {
		const res = await request(serverAddress).get("/api/vote");

		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Array);
	});
});
