const request = require("supertest");
const { Mentor } = require("../../models/mentors");
let server;
jest.setTimeout(30000);

describe("/api/mentors", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();

    await Mentor.remove({});
  });

  //GET ALL
  describe("GET/", () => {
    it("should return all mentors", async () => {
      //mongodb ye aynı anda birden çok doküman ekleme
      await Mentor.collection.insertMany([
        { name: "mentor1" },
        { name: "mentor2" },
      ]);
      const res = await request(server).get("/api/mentors");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((m) => m.name === "mentor1")).toBeTruthy();

      expect(res.body.some((m) => m.name === "mentor2")).toBeTruthy();
    });
  });

  //GET ONLINE
  describe("GET/online", () => {
    it("should return online mentor", async () => {
      await Mentor.collection.insertMany([
        { name: "Mentor1", online: true },
        { name: "Mentor2", online: false },
      ]);

      const res = await request(server).get("/api/mentors/online");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body.some((m) => m.name === "Mentor1")).toBeTruthy();
    });
  });

  // UNINAME
  describe("GET /uni/:uniname", () => {
    it("should return mentors accoording to uniname ", async () => {
      await Mentor.collection.insertMany([
        { name: "Mentor1", uni: "Galatasaray" },
        { name: "Mentor2", uni: "Boğaziçi" },
      ]);
      const res = await request(server).get(
        "/api/mentors/uni/" + "Galatasaray"
      );
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body.some((m) => m.name === "Mentor1")).toBeTruthy();
    });
  });

  //get major
  describe("GET /major/:majorname", () => {
    it("should return mentors accoording to majorname ", async () => {
      await Mentor.collection.insertMany([
        { name: "Mentor1", major: "CS" },
        { name: "Mentor2", major: "Economy" },
      ]);
      const res = await request(server).get("/api/mentors/major/" + "CS");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body.some((m) => m.name === "Mentor1")).toBeTruthy();
    });
  });

  //get unimajor
  describe("GET /uniMajor/:domain/:nav", () => {
    it("should return mentors accoording to uniname if domain is uni ", async () => {
      await Mentor.collection.insertMany([
        { name: "Mentor1", major: "CS", uni: "Galatasaray" },
        { name: "Mentor2", major: "Economy", uni: "Boğaziçi" },
      ]);
      const res = await request(server).get(
        "/api/mentors/uniMajor/" + "uni" + "/" + "Galatasaray"
      );
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body.some((m) => m.name === "Mentor1")).toBeTruthy();
    });

    it("should return mentors accoording to majorname if domain is major ", async () => {
      await Mentor.collection.insertMany([
        { name: "Mentor1", major: "CS", uni: "Galatasaray" },
        { name: "Mentor2", major: "Economy", uni: "Boğaziçi" },
      ]);
      const res = await request(server).get(
        "/api/mentors/uniMajor/" + "major" + "/" + "CS"
      );
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body.some((m) => m.name === "Mentor1")).toBeTruthy();
    });
  });

  //Most Calls

  describe("GET /calls", () => {
    it("should return  mentors that did most calls", async () => {
      await Mentor.collection.insertMany([
        { name: "Mentor1", calls: 2 },
        { name: "Mentor2", calls: 4 },
        { name: "Mentor3", calls: 1 },
        { name: "Mentor4", calls: 5 },
        { name: "Mentor5", calls: 8 },
        { name: "Mentor6", calls: 10 },
      ]);

      const res = await request(server).get("/api/mentors/calls");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(5);
      expect(res.body.some((m) => m.name === "Mentor4")).toBeTruthy();
      expect(res.body[2]).toHaveProperty("name", "Mentor4");
    });
  });

  //ranking

  //post mentor
  describe("POST /", () => {
    it("should return 400 if name is missing", async () => {
      const res = await request(server)
        .post("/api/mentors/")
        .send({ uni: "a" });
      expect(res.status).toBe(400);
    });

    it("should return 400 if name has more than 20 caracters", async () => {
      const res = await request(server)
        .post("/api/mentors/")
        .send({ uni: "a", name: new Array(25).join("a") });
      expect(res.status).toBe(400);
    });

    it("should return 200 if it is valid", async () => {
      const res = await request(server)
        .post("/api/mentors/")
        .send({ uni: "a", name: "Mentor1" });
      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty("name", "Mentor1");
      expect(res.body).toHaveProperty("_id");
    });

    it("should save the mentor to the db if it is valid", async () => {
      await request(server)
        .post("/api/mentors/")
        .send({ uni: "a", name: "Mentor1" });

      const mentor = await Mentor.find({ name: "Mentor1" });
      expect(mentor).not.toBeNull();
    });
  });

  //GET ACCORDING TO ID
  describe("GET /:id", () => {
    it("should return a mentor if valid id is passed", async () => {
      const mentor = new Mentor({ name: "mentor1" });
      await mentor.save();

      const res = await request(server).get("/api/mentors/" + mentor._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", mentor.name);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/mentors/1");
      expect(res.status).toBe(404);
    });
  });
});
