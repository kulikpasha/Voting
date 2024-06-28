const request = require("supertest");
const serverAddress = "http://localhost:5000";

describe("UserController", () => {
	it("should register a user", async () => {
		const res = await request(serverAddress)
			.post("/api/user/registration")
			.send({
				user_name: "test_user",
				email: "test@test.com",
				password: "password",
			});

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("id");
	});

	it("should return user ID", async () => {
		const res = await request(serverAddress).get("/api/user/auth?id=1");

		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual("1");
	});
});
