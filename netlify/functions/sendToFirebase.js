const admin = require("firebase-admin");

let app;

function initFirebase() {
  if (!app) {
    // Check env vars
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
    const databaseURL = process.env.FIREBASE_DATABASE_URL;

    if (!serviceAccountString || !databaseURL) {
      throw new Error(
        "Missing Firebase environment variables. Make sure FIREBASE_SERVICE_ACCOUNT and FIREBASE_DATABASE_URL are set."
      );
    }

    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountString);
    } catch (err) {
      throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT JSON: " + err.message);
    }

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: databaseURL.replace(/\/$/, ""), // remove trailing slash
    });
  }
  return app;
}

exports.handler = async (event) => {
  try {
    const { value } = JSON.parse(event.body);
    if (!value) return { statusCode: 400, body: "No value provided" };

    initFirebase();
    const db = admin.database();
    const ref = db.ref("reported_words"); // Node for your stored values

    const snapshot = await ref.once("value");
    let values = snapshot.val() || [];

    if (values.includes(value)) {
      return { statusCode: 200, body: "Value already exists" };
    }

    values.push(value);
    await ref.set(values);

    return { statusCode: 200, body: "Value sent successfully" };
  } catch (err) {
    console.error("Firebase Function Error:", err);
    return { statusCode: 500, body: err.message };
  }
};