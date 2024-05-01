const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(cookieParser);


app.post("/auth", async (req, res) => {
  console.log('auth')

  // const collections = await admin.firestore().listCollections().then(list => list.map(c => c.id));
  const { token } = req.body;
  const masterKey = process.env.AUTH_KEY;

  console.log({token,masterKey })
  if (token == masterKey) {
    admin.auth().createCustomToken('admin')
      .then(customToken => {
        res.status(200).json({customToken});
      })
      .catch(error => {
        console.error({error});
        res.status(500).json({message: 'error-creating-token'});
      });
  } else {
    res.status(422).json({message: 'invalid-admin-token'});
  }
});

async function verifyToken(req, res, next) {
  console.log('verifyToken');
  const idToken = req.get("Authorization");
  console.log({idToken});

  if (!idToken) return res.status(403).json({message: 'no token'})

  const a = admin.auth();
  a.verifyIdToken(idToken)
    .then(_ => next()) // Passing anything to `next` is an error
    .catch(error => {
      res.status(403).json({message: 'not authorised'});
    })
}

app.get("/collections", verifyToken, async (req, res) => {
  console.log('collections')
  const collections = await admin.firestore().listCollections().then(list => list.map(c => c.id));
  res.status(200).json({collections});
});

app.get("/check-auth", verifyToken, (_req, res) => {
  console.log('check auth')
  res.status(200).json({message: 'yay!'})
});

exports.adminApp = app;
