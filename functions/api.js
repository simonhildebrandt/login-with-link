const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const AWS = require("aws-sdk");

const { getRecordByKeyValue, checkToken } = require("./utils");

const { formatEmailSubject, formatTextEmail, formatHtmlEmail } = require('./email-template');
const { LOGIN_WINDOW, DEFAULT_LOGIN_LIMIT } = require('./constants');

AWS.config.update({ region: process.env.AWS_REGION });


const API_URL = process.env.API_URL || "http://localhost:5001/login-with-link/us-central1";
const SITE_URL = process.env.SITE_URL || "http://localhost:9000";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use((req, res, next) => {
  // Clear function name out of url for Firebase rewrite
  req.url = req.url.replace(/\/api/, "");
  next();
});

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
    .then(async apiKey => {
      if (apiKey) {
        const { clientId } = apiKey;
        const client = await admin.firestore().collection("clients").doc(clientId).get();
        const data = client.data();
        if (client.exists) return res.json({ name: data.name, style: data.style })
      };

      return res.status(404).json({ error: "No api key or client found" });
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
      apiKey: apiKey.key,
      uuid: uuidv4(),
      returnUrl: apiKey.returnUrl,
      followedAt: [],
      createdAt: new Date().valueOf()
    })
    .then(getMergedFromRef)
}

function emailLink({ email, url, client }) {
  const payload = data => ({ Charset: "UTF-8", Data: data });

  const params = { client_name: client.name, style: client.style, link: url, host: SITE_URL };

  const data = {
    Destination: { ToAddresses: [email] },
    Message: {
      Body: {
        Html: payload(formatHtmlEmail(params)),
        Text: payload(formatTextEmail(params))
      },
      Subject: payload(formatEmailSubject(params))
    },
    Source: "help@login-with.link"
  };

  return new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(data).promise();
}

async function sendLink(key, email) {
  const apiKey = await getRecordByKeyValue("apiKeys", "key", key)
    .catch(error => Promise.reject({ error, status: 404, message: "Error loading api key data" }));

  if (!apiKey) throw { status: 404, message: "No api key found" };

  const { loginLimit = DEFAULT_LOGIN_LIMIT } = apiKey;

  const previousLogins = await admin.firestore().collection("loginLinks")
    .where("apiKey", "==", key)
    .where("createdAt", ">", (new Date()).valueOf() - LOGIN_WINDOW)
    .get();

  if (previousLogins.size >= loginLimit) throw {
    status: 422,
    message: `This client has exceeded their login limit of ${loginLimit} in 24 hours.`
  };

  console.log(`${key} had ${previousLogins.size} previous logins`);

  const { clientId } = apiKey;
  const clientRef = await admin.firestore().collection("clients").doc(clientId).get();
  if (!clientRef.exists) throw { status: 404, message: "No client found" };
  const client = clientRef.data();

  const link = await createLoginLink(apiKey, email);
  if (!link) throw { message: "Error creating link" };

  const url = `${API_URL}/api/done/${link.uuid}`;

  return emailLink({ email, url, client });
}

app.post("/send-link", async (req, res) => {
  const { email, key } = req.body;
  if (!email || !key)
    return res.status(404).json({ error: "Email address and api key required" });

  sendLink(key, email)
    .then(_ => res.json({ message: "success" }))
    .catch(error => {
      console.error({ error });
      const { status = 500, message } = error;
      res.status(status).json({ message });
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

      const apiKeyData = await getRecordByKeyValue("apiKeys", "key", apiKey)
      // TODO append 'followedAt'

      token = jwt.sign({ email }, apiKeyData.secret, { ...jwtDefaults, subject: userId });
      res.redirect(returnUrl + "?lwl-token=" + token);
    })
    .catch(error => {
      console.log(error)
      res.redirect(`${SITE_URL}/login_error?error=no-link-found`);
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
