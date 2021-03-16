const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const AWS = require("aws-sdk");

const { getRecordByKeyValue, checkToken } = require("./utils");


AWS.config.update({ region: process.env.AWS_REGION });


const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

function getMergedFromRef(ref) {
  return ref.get().then(obj => {
    return {
      id: obj.id,
      ...obj.data()
    };
  });
}

app.get("/keys/:key", async (req, res) => {
  return getRecordByKeyValue("apiKeys", "key", req.params.key)
    .then(apiKey => {
      if (apiKey) return res.json({ valid: true });
      return res.status(404).json({ error: "No api key found" });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Error loading api key data" });
    });
});

async function createLoginLink(apiKey, email) {
  let user = await getRecordByKeyValue("users", "email", email);
  if (!user) {
    user = await admin.firestore().collection('users')
      .add({ email, createdAt: new Date().valueOf() })
      .then(getMergedFromRef);
  }

  return admin.firestore().collection('loginLinks')
    .add({
      email,
      userId: user.id,
      apiKey: apiKey.id,
      uuid: uuidv4(),
      returnUrl: apiKey.returnUrl,
      followedAt: [],
      createdAt: new Date().valueOf()
    })
    .then(getMergedFromRef)
}

function emailLink({ email, url }) {
  const payload = data => ({ Charset: "UTF-8", Data: data });

  const params = {
    Destination: { ToAddresses: [email] },
    Message: {
      Body: {
        Html: payload(`<a href="${url}">Click this link</a>`),
        Text: payload("Click this link: " + url)
      },
      Subject: payload("Login with link for [customer]")
    },
    Source: "simonhildebrandt@gmail.com"
  };

  return new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
}

app.post("/send-link", async (req, res) => {
  const { email, key } = req.body;
  if (!email || !key)
    return res.status(404).json({ error: "Email address and api key required" });

  return getRecordByKeyValue("apiKeys", "key", key)
    .then(apiKey => {
      if (!apiKey) return res.status(404).json({ error: "No api key found" });

      return createLoginLink(apiKey, email)
        .then(link => {
          const url = `http://localhost:5001/login-with-link/us-central1/api/done/${link.uuid}`;

          return emailLink({ email, url })
            .then(() => res.json({ message: "success" }))
            .catch(err => console.error(err))

        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ error: "Failed to send link" });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Error loading api key data" });
    });
});

const jwtDefaults = {
  issuer: "login-with-link",
  audience: ["login-with-link"]
};

app.get("/done/:id", async (req, res) => {
  return getRecordByKeyValue("loginLinks", "uuid", req.params.id)
    .then(async link => {
      const {
        returnUrl,
        userId,
        email,
        apiKey
      } = link;

      const apiKeyData = await admin.firestore().collection('apiKeys')
        .doc(apiKey).get().then(d => d.data());

      if (!apiKeyData) return Promise.reject("Couldn't find apiKey");

      // TODO append 'followedAt'

      token = jwt.sign({ email }, apiKeyData.secret, { ...jwtDefaults, subject: userId });
      res.redirect(returnUrl + "?lwl-token=" + token);
    })
    .catch(error => {
      console.log(error)
      res.redirect("http://localhost:9000/login_error?error=no-link-found");
    });
});

app.get("/check", async (req, res) => {
  const { token, apiKey } = req.query;

  checkToken(token, apiKey).then(
    result => {
      switch (result) {
        case 'token-or-key-missing':
          res.status(401).json({ message: "No token" })
        case 'token-invalid':
          res.status(401).json({ message: "failed token check" })
        case 'token-valid':
          res.status(200).json({ message: "valid token" })
        default:
          res.status(500).end();
      }
    });
});

exports.apiApp = app;
