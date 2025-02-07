import { test, after, beforeEach, describe } from "node:test";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import assert from "assert";
import * as helper from "./test_helper.js";
import Blog from "../models/blogSchema.js";
import bcrypt from "bcrypt";
import User from "../models/userSchema.js";
import { response } from "express";

const api = supertest(app);

// Global variable for the user
let user;
const userForTest = {
  username: "root",
  password: "sekret",
};

beforeEach(async () => {
  // Clear the database
  await User.deleteMany({});
  await Blog.deleteMany({});

  // Create a user
  const passwordHash = await bcrypt.hash("sekret", 10);
  user = new User({ username: "root", passwordHash });
  await user.save();

  // Insert initial blogs
  await Blog.insertMany(helper.initialBlogs);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("Enough blogs are returned", async () => {
  const res = await api.get("/api/blogs");
  assert.strictEqual(res.body.length, 2);
});

test("valid ID", async () => {
  const res = await api.get("/api/blogs");
  res.body.forEach((blog) => {
    const isID = blog.hasOwnProperty("id");
    assert.deepStrictEqual(isID, true);
  });
});

test("created successfully", async () => {
  const newPost = {
    title: "MR world",
    author: "bin gates",
    url: "https://www.youtube.com/watch?v=Cq3ebyAou30",
    likes: 100,
  };

  // Get the initial number of blogs
  const initialLength = (await api.get("/api/blogs")).body.length;
  const loginResponse = await api.post("/api/login").send(userForTest); // Use the plaintext password here

  let token = loginResponse.body.token;
  console.log(token);
  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newPost)
    .expect(201);
  const updatedRes = await api.get("/api/blogs");
  const updatedLength = updatedRes.body.length;

  const title = updatedRes.body.map((r) => r.title);

  assert.strictEqual(updatedLength, initialLength + 1);
  assert(title.includes("MR world"));
});

test("likes property defaults to 0 if missing", async () => {
  const newPost = {
    title: "MR world",
    author: "bin gates",
    url: "https://www.youtube.com/watch?v=Cq3ebyAou30",
    user: user._id, // Using the global user
  };
  const initialLength = (await api.get("/api/blogs")).body.length;
  const loginResponse = await api.post("/api/login").send(userForTest); // Use the plaintext password here

  let token = loginResponse.body.token;
  const res = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newPost)
    .expect(201);
  assert.strictEqual(res.body.likes, 0);
});

test("400 Bad Request if title is missing", async () => {
  const newBlog = {
    url: "http://example.com",
    author: "John Doe",
    likes: 20,
    user: user._id, // Using the global user
  };
  const loginResponse = await api.post("/api/login").send(userForTest); // Use the plaintext password here

  let token = loginResponse.body.token;
  const res = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400);
  assert(res.body.error.includes("url or title is missing"));
});

test("400 Bad Request if url is missing", async () => {
  const newBlog = {
    title: "Test Blog",
    author: "John Doe",
    likes: 10,
    user: user._id, // Using the global user
  };

  const loginResponse = await api.post("/api/login").send(userForTest); // Use the plaintext password here

  let token = loginResponse.body.token;

  const res = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400);
  assert(res.body.error.includes("url or title is missing"));
});

test("deleted successfully with status code 204", async () => {
  const newBlog = {
    title: "Test Blog",
    author: "John Doe",
    likes: 10,
    url: "http://example.com",
  };
  const loginResponse = await api.post("/api/login").send(userForTest);
  const token = loginResponse.body.token;

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog);
  const res = await api.get("/api/blogs");
  const deletedBlog = res.body[res.body.length - 1];
  console.log("deleted: ", deletedBlog);
  await api
    .delete(`/api/blogs/${deletedBlog.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);

  const updatedBlogs = await api.get("/api/blogs");
  assert.strictEqual(updatedBlogs.body.length, res.body.length - 1);
});

test("updated successfully with status code 200", async () => {
  const blogsAtStart = await helper.blogsInDb();
  let blogToUpdate = blogsAtStart[0];
  const updatedBlog = { ...blogToUpdate, likes: 203 };

  await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200);

  const updatedBlogs = await api.get("/api/blogs");
  assert.strictEqual(updatedBlogs.body[0].likes, 203);
});

// User tests
describe("when there is initially one user in db", () => {
  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "hadao",
      name: "Ha Dao",
      password: "helloworld",
    };

    await api
      .post("/api/users/") // Create a new user
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("invalid users are not created", async () => {
    const newUser = {
      username: "ha",
      name: "Ha Dao",
      password: "helloworld",
    };

    const res = await api.post("/api/users/").send(newUser).expect(400);
    assert(
      res.body.error.includes(
        "User validation failed: username: Path `username` (`ha`) is shorter than the minimum allowed length (3)."
      )
    );
  });
});

test("failed with status code 404 Unauthorized", async () => {
  const newBlog = {
    title: "Test Blog",
    author: "John Doe",
    likes: 10,
    url: "http://example.com",
  };

  const res = await api.post("/api/blogs").send(newBlog).expect(401);
  assert.strictEqual(res.status, 401);
});

after(async () => {
  // Close the mongoose connection after tests
  await mongoose.connection.close();
});
