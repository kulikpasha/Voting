const request = require("supertest");
const serverAddress = "http://localhost:5000";

describe("AnswerController", () => {
	it("should create an answer", async () => {
		const res = await request(serverAddress).post("/api/answer").send({
			question_id: 1,
			answer: "Test answer",
		});

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("id");
	});

	it("should get all answers", async () => {
		const res = await request(serverAddress).get("/api/answer");

		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Array);
	});
});
