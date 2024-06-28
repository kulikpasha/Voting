const request = require("supertest");
const serverAddress = "http://localhost:5000";

describe("QuestionController", () => {
	it("should create a question", async () => {
		const res = await request(serverAddress).post("/api/question").send({
			poll_id: 1,
			question_text: "Test question",
		});

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("id");
	});

	it("should get all questions", async () => {
		const res = await request(serverAddress).get("/api/question?poll_id=1");

		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Array);
	});
});
