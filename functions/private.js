const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const express = require('express');
const cors = require('cors');

const { checkToken } = require("./utils");

const authKey = "6870e340-2465-4da8-96fa-26c3027dc7e3";

const app = express();
app.use(cors({ origin: true }));

// Authentication
app.use((req, res, next) => {
  const token = req.get("Authorization");
  checkToken(token, authKey).then(
    result => {
      if (result == 'token-valid') {
        req.user = jwt.decode(token);
        next()
      } else {
        res.status(401).json({message: "Valid token required"})
      }
    }
  )
});

// Client visibility
app.use((req, _res, next) => {
  const { sub: userId } = req.user;

  return admin.firestore().collection("clients")
  .where("owners", "array-contains", userId)
  .get()
  .then(collectQueryResults)
  .then(clients => {
    req.clients = clients;
    next();
  });
});

// Client authorisation
function accessCheck(req, res, next) {
  const { clientId } = req.params;

  const clientIds = req.clients.map(client => client.id)
  if (clientIds.includes(clientId)) {
    next();
  } else {
    res.status(403).json({message: "Invalid client access"});
  }
};

function collectQueryResults(querySnapshot) {
  return querySnapshot.docs.map(doc => (
    { id: doc.id, ...doc.data() }
  ))
}

function createApiKey(clientId) {
  const key = uuidv4();

  const keyDefaults = {
    clientId,
    key,
    name: `key - ${key}`,
    returnUrl: "http://yoursite.com/landing?",
    secret: uuidv4()
  };

  return admin.firestore().collection("apiKeys").add(keyDefaults)
}

app.get("/clients", async (req, res) => {
  res.json(req.clients);
});

app.post("/clients", async (req, res) => {
 
  console.log(req.user);

  const clientDefaults = {
    name: `NewClient`,
    owners: [req.user.sub]
  };

  return admin.firestore().collection("clients")
  .add(clientDefaults)
  .then(({id}) => createApiKey(id))
  .then(() => {
    res.json({message: "New client created"});
  });
});

app.delete("/clients/:clientId", async (req, res) => {
  const { clientId } = req.params;
  return admin.firestore().collection("clients")
  .doc(clientId)
  .delete()
  .then(() => {
    res.json({message: "Client deleted"});
  })
});

app.put("/clients/:clientId", async (req, res) => {
  const { clientId } = req.params;
  const data = req.body;

  return admin.firestore().collection("clients")
  .doc(clientId)
  .update(data)
  .then(() => {
    res.json({message: "Client updated"});
  })
});

app.get("/clients/:clientId/keys", accessCheck, async (req, res) => {
  const { clientId } = req.params;

  return admin.firestore().collection("apiKeys")
  .where("clientId", "==", clientId)
  .get()
  .then(collectQueryResults)
  .then(keys => res.json(keys));
});

app.post("/clients/:clientId/keys", accessCheck, async (req, res) => {
  const { clientId } = req.params;

  createApiKey(clientId)
  .then(() => res.json({message: "New key created"}));
});

app.put("/clients/:clientId/keys/:key", accessCheck, async (req, res) => {
  const { key } = req.params;

  return admin.firestore().collection("apiKeys")
  .where("key", "==", key)
  .get()
  .then(qs => {
    if (qs.size !== 1) throw(new Error("Didn't find a matching key"))

    const { name, returnUrl } = req.body;
    qs.docs[0].ref.update({ name, returnUrl }).then(() => {
      res.json({Message: "Updated"});
    }).catch(() => res.status(500).json({message: "update failed"}));
  })
});

app.delete("/clients/:clientId/keys/:key", accessCheck, async (req, res) => {
  const { key } = req.params;

  return admin.firestore().collection("apiKeys")
  .where("key", "==", key)
  .get()
  .then()
  .then(qs => {
    if (qs.size !== 1) throw(new Error("Didn't find a matching key"))

    qs.docs[0].ref.delete().then(() => {
      res.json({Message: "Deleted"});
    }).catch(() => res.status(500).json({message: "delete failed"}));
  })
});

exports.privateApp = app;
