import twilio from "twilio";
import express from "express";

const accountSid = "AC001ca82c0163d6fe719af642886a5b21";
const authToken = "a5add0b956056b58873f003c88586aaa";
const serviceId = "VAab41affe3530c0f2c949fc6cfcc788e3";

const client = new twilio(accountSid, authToken);

const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Welcome to Verfication service!"));

app.get("/verify/:to", async (req, res) => {
  const to = req.params.to;

  client.verify
    .services(serviceId)
    .verifications.create({ to, channel: "sms" })
    .then((verification) => {
      res.json(verification);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/check/:to/:code", async (req, res) => {
  const to = req.params.to;
  const code = req.params.code;
  client.verify
    .services(serviceId)
    .verificationChecks.create({ to, code })
    .then((verification) => {
      res.json(verification);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.listen(port);
