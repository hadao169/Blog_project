import bcrypt from "bcrypt";
import User from "../models/userSchema.js";
import * as helper from "./test_helper.js";
import { test, after, beforeEach, describe } from "node:test";

// describe("when there is initially one user in db", () => {
//   beforeEach(async () => {
//     await User.deleteMany({});

//     const passwordHash = await bcrypt.hash("sekret", 10);
//     const user = new User({ username: "root", passwordHash });

//     await user.save();
//   });

//   test("creation succeeds with a fresh username", async () => {
//     const usersAtStart = await helper.usersInDb();

//     const newUser = {
//       username: "hadao",
//       name: "Ha Dao",
//       password: "helloworld",
//     };

//     await api
//       .post("/api/users")
//       .send(newUser)
//       .expect(201)
//       .expect("Content-Type", /application\/json/);

//     const usersAtEnd = await helper.usersInDb();
//     assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

//     const usernames = usersAtEnd.map((u) => u.username);
//     assert(usernames.includes(newUser.username));
//   });
// });
