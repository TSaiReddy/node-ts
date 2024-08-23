import request from "supertest";
import { app } from "../src/index";

describe("POST /api/user/signin", () => {
  it("should return 200 and a token for valid email and password", async () => {
    const response = await request(app).post("/api/user/signin").send({
      email: "saikumarreddy44@gmail.com",
      password: "Saireddy@123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
  });

  it("should return 400 for invalid email or password", async () => {
    const response = await request(app).post("/api/user/signin").send({
      email: "wrong@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "We could not find an account with the email you provided."
    );
  });
});

describe("POST /api/user/", () => {
  it("should return 200 and a token for valid registration data", async () => {
    const response = await request(app).post("/api/user/").send({
      first_name: "John",
      email: "johndoe@example2.com",
      password: "Password123!",
      role: "admin",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
  });

  it("should return 400 if email already exists", async () => {
    const response = await request(app).post("/api/user/").send({
      first_name: "sai",
      email: "saikumarreddy44@gmail.com",
      password: "Password123!",
      role: "admin",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email Already Exist");
  });
});
