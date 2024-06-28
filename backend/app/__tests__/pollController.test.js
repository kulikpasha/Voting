const request = require("supertest");
const serverAddress = "http://localhost:5000";

describe("PollController", () => {
	it("should create a poll", async () => {
		const res = await request(serverAddress).post("/api/poll").send({
			user_id: 1,
			user_name: "test_user",
			title: "Test Poll",
			description: "This is a test poll",
			isOpen: true,
		});

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("id");
	});

	it("should get all polls", async () => {
		const res = await request(serverAddress).get("/api/poll");

		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Array);
	});
});
