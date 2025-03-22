const { login } = require("../../controllers/authController");
const Student = require("../../models/studentModel");
const Teacher = require("../../models/teacherModel");
const jwt = require("jsonwebtoken");

// Mock dependencies
jest.mock("../../models/studentModel");
jest.mock("../../models/teacherModel");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
        role: "student",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jwt.sign = jest.fn().mockReturnValue("mock-jwt-token");
    process.env.SECRET = "test-secret";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should login a student successfully", async () => {
    // Mock successful student login
    const mockStudent = {
      _id: "123",
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      role: "student",
    };

    Student.login.mockResolvedValueOnce(mockStudent);

    await login(req, res);

    expect(Student.login).toHaveBeenCalledWith(
      "test@example.com",
      "password123"
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { _id: "123", role: "student" },
      "test-secret",
      { expiresIn: "3d" }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: "123",
      email: "test@example.com",
      token: "mock-jwt-token",
      firstName: "John",
      lastName: "Doe",
      role: "student",
    });
  });

  test("should login a teacher successfully", async () => {
    // Change role to teacher
    req.body.role = "teacher";

    // Mock successful teacher login
    const mockTeacher = {
      _id: "456",
      firstName: "Jane",
      lastName: "Smith",
      email: "test@example.com",
      nic: "123456789V",
      role: "teacher",
    };

    Teacher.login.mockResolvedValueOnce(mockTeacher);

    await login(req, res);

    expect(Teacher.login).toHaveBeenCalledWith(
      "test@example.com",
      "password123"
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { _id: "456", role: "teacher" },
      "test-secret",
      { expiresIn: "3d" }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: "456",
      email: "test@example.com",
      token: "mock-jwt-token",
      firstName: "Jane",
      lastName: "Smith",
      nic: "123456789V",
      role: "teacher",
    });
  });

  test("should handle invalid role", async () => {
    // Invalid role
    req.body.role = "invalid";

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid role specified" });
  });

  test("should handle login error", async () => {
    // Mock login error
    Student.login.mockRejectedValueOnce(new Error("Invalid credentials"));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });
});
