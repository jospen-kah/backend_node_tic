const { authRegisterController } = require("../../controllers/auth");
const User = require("../../auth/usersSchema");
const bcrypt = require("bcrypt");

// Mock the bcrypt library
jest.mock("bcrypt", () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
}));

// Mock the User schema
jest.mock("../../auth/usersSchema", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

const request = {
  body: {
    username: "fake_username",
    email: "fake_email",
    password: "fake_password",
  },
};

const response = {
  status: jest.fn().mockReturnThis(), // Enable chaining
  json: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks(); // Clear mock calls between tests
});

it("should send a status code of 400 when a user exists", async () => {
  // Mock User.findOne to simulate an existing user
  User.findOne.mockResolvedValueOnce({
    id: 1,
    email: "fake_email",
    password: "hashedpassword",
  });

  await authRegisterController(request, response);

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({ message: "User already exist"});
});

it("should send a status code of 201 when a user is created", async () => {
  // Mock User.findOne to simulate no existing user
  User.findOne.mockResolvedValueOnce(null);

  // Mock bcrypt methods
  bcrypt.genSalt.mockResolvedValueOnce("fakesalt");
  bcrypt.hash.mockResolvedValueOnce("hashedpassword");

  // Mock User.create to simulate successful user creation
  User.create.mockResolvedValueOnce({
    id: 1,
    username: "fake_username",
    email: "fake_email",
    password: "hashedpassword",
  });

  await authRegisterController(request, response);

  expect(User.findOne).toHaveBeenCalledWith({ email: "fake_email" });
  expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
  expect(bcrypt.hash).toHaveBeenCalledWith("fake_password", "fakesalt");
  expect(User.create).toHaveBeenCalledWith({
    username: "fake_username",
    email: "fake_email",
    password: "hashedpassword",
  });
  expect(response.status).toHaveBeenCalledWith(201);
  expect(response.json).toHaveBeenCalledWith({
  message: "User registered successfully!",
 });
});
