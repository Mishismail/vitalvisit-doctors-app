const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const { expect } = chai;
const mongoose = require("mongoose");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");

chai.use(chaiHttp);

describe("Booking Availability Controller", () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should return doctor not found", (done) => {
    chai
      .request(app)
      .post("/api/user/booking-availability")
      .send({ doctorId: "invalidId", date: "2023-01-01", time: "10:00" })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message", "Doctor not found");
        done();
      });
  });

  // Add more tests for other scenarios
});

describe("Book Appointment Controller", () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should return doctor not found", (done) => {
    chai
      .request(app)
      .post("/api/user/book-appointment")
      .send({ doctorId: "invalidId", userId: "validUserId", date: "2023-01-01", time: "10:00", reason: "Checkup" })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message", "Doctor Not Found");
        done();
      });
  });

});