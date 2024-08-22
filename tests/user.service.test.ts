import request from "supertest";
import AuthService from "../src/helpers/AuthService";

const mockUser = {
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  password: "password123",
};

describe("POST /login", () => {
  beforeEach(async () => {
    const hashPassword = AuthService.hashPassword(mockUser.password);
  });
  it("should login with correct user details", async () => {
    const response = await request;
  });
  it("should fail with in-correct user details");
});
