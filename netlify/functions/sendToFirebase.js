const admin = require("firebase-admin");

let app;

// Initialize Firebase Admin only once (Netlify caches)
function initFirebase() {
  if (!app) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }
  return app;
}

exports.handler = async (event) => {
  try {
    const { value } = JSON.parse(event.body);
    if (!value) return { statusCode: 400, body: "No value provided" };

    const app = initFirebase();
    const db = admin.database();
    const ref = db.ref("values"); // store values under "values"

    const snapshot = await ref.once("value");
    let values = snapshot.val() || [];

    if (values.includes(value)) {
      return { statusCode: 200, body: "Value already exists" };
    }

    values.push(value);
    await ref.set(values);

    return { statusCode: 200, body: "Value sent successfully" };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Error sending value" };
  }
};