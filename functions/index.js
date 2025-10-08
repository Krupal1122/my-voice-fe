// const functions = require('firebase-functions');
// const { onCall } = require("firebase-functions/v2/https");
// const { setGlobalOptions } = require("firebase-functions");
// const logger = require("firebase-functions/logger");
// const admin = require("firebase-admin");
// const nodemailer = require("nodemailer");

// admin.initializeApp();

// setGlobalOptions({ maxInstances: 10 });

// // Configure email transport
// const cfg = functions.config && functions.config();
// const EMAIL_USER = cfg?.email?.user || process.env.EMAIL_USER || 'grow.code.solutions24@gmail.com';
// const EMAIL_PASS = cfg?.email?.pass || process.env.EMAIL_PASS || 'bbke whxu atms tbpw';

// let transporter = null;
// if (EMAIL_USER && EMAIL_PASS) {
//     transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: { user: EMAIL_USER, pass: EMAIL_PASS },
//     });
// }

// exports.sendOtp = onCall(async (request) => {
//     logger.info("sendOtp function called", request.auth ? { uid: request.auth.uid } : { unauthenticated: true });
//     const email = request.data.email;
//     logger.info("Email received:", email);

//     if (!email) {
//         logger.error("Missing email in request");
//         throw new functions.https.HttpsError("invalid-argument", "Email is required.");
//     }

//     try {
//         // Check if user exists
//         const user = await admin.auth().getUserByEmail(email);
//         logger.info("User found for email: " + email);

//         // Generate 6-digit OTP
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         const expiration = Date.now() + 5 * 60 * 1000; // 5 minutes from now

//         // Store OTP in Firestore (collection: otps)
//         const otpRef = await admin.firestore().collection("otps").add({
//             email,
//             otp,
//             expiration,
//             used: false,
//             createdAt: admin.firestore.FieldValue.serverTimestamp(),
//         });
//         logger.info("OTP stored in Firestore with ID: " + otpRef.id);

//         // Send email
//         // Send email if transporter available; otherwise dev fallback
//         if (transporter) {
//             await transporter.sendMail({
//                 from: EMAIL_USER,
//                 to: email,
//                 subject: "MyVoice974 - Code de vérification",
//                 text: `Votre code est : ${otp}. Expire dans 5 minutes.`,
//                 html: `<p>Votre code est : <strong>${otp}</strong>. Expire dans 5 minutes.</p>`,
//             });
//             logger.info("OTP sent successfully to " + email);
//             return { success: true };
//         } else {
//             logger.warn("[DEV] Email creds not set. OTP:", otp, "for", email);
//             return { success: true, dev: true };
//         }
//     } catch (error) {
//         logger.error("Error in sendOtp:", error);
//         if (error.code === "auth/user-not-found") {
//             throw new functions.https.HttpsError("failed-precondition", "Aucun compte trouvé avec cette adresse email.");
//         } else if (error.code === "auth/invalid-email") {
//             throw new functions.https.HttpsError("invalid-argument", "Adresse email invalide.");
//         }
//         throw new functions.https.HttpsError("internal", "Erreur interne du serveur: " + error.message);
//     }
// });

// exports.verifyOtpAndReset = onCall(async (request) => {
//     logger.info("verifyOtpAndReset function called", request.auth ? { uid: request.auth.uid } : { unauthenticated: true });
//     const { email, otp, newPassword } = request.data;

//     if (!email || !otp || !newPassword) {
//         logger.error("Missing required fields in verifyOtpAndReset");
//         throw new functions.https.HttpsError("invalid-argument", "Missing required fields.");
//     }

//     try {
//         // Find the OTP doc in Firestore
//         const otpsRef = admin.firestore().collection("otps");
//         const snapshot = await otpsRef.where("email", "==", email).where("otp", "==", otp).where("used", "==", false).get();

//         if (snapshot.empty) {
//             logger.error("No valid OTP found for email: " + email);
//             throw new functions.https.HttpsError("not-found", "Invalid or expired OTP.");
//         }

//         const otpDoc = snapshot.docs[0];
//         const data = otpDoc.data();

//         if (Date.now() > data.expiration) {
//             logger.error("OTP expired for email: " + email);
//             throw new functions.https.HttpsError("deadline-exceeded", "OTP has expired.");
//         }

//         // Get user by email and reset password
//         const user = await admin.auth().getUserByEmail(email);
//         await admin.auth().updateUser(user.uid, { password: newPassword });

//         // Mark OTP as used
//         await otpDoc.ref.update({ used: true });
//         logger.info("Password reset successfully for " + email);

//         return { success: true };
//     } catch (error) {
//         logger.error("Error in verifyOtpAndReset:", error);
//         throw new functions.https.HttpsError("internal", "Erreur interne du serveur: " + error.message);
//     }
// });


const { onRequest, onCall } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");
const cors = require("cors");
const nodemailer = require("nodemailer");

admin.initializeApp();
setGlobalOptions({ region: "us-central1" });

const corsHandler = cors({ origin: true }); // allows all origins, or specify array

// Configure email transport (Gmail or SMTP)
const cfg = process.env; // Prefer environment variables on hosting platform
const EMAIL_USER = cfg.EMAIL_USER || (process.env.EMAIL_USER || null);
const EMAIL_PASS = cfg.EMAIL_PASS || (process.env.EMAIL_PASS || null);

let transporter = null;
if (EMAIL_USER && EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
}

// Helper to generate a 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// HTTP endpoint: send OTP to email if user exists in Firebase Auth
exports.sendOtp = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === "OPTIONS") {
      // Handle preflight
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      return res.status(204).send("");
    }

    try {
      const { email } = req.method === "POST" ? req.body : req.query;
      if (!email) {
        res.set("Access-Control-Allow-Origin", "*");
        return res.status(400).send({ error: "Email is required" });
      }

      // Verify user exists in Firebase Auth
      await admin.auth().getUserByEmail(email);

      const otp = generateOtp();
      const expiration = Date.now() + 5 * 60 * 1000; // 5 minutes

      // Store OTP in Firestore
      await admin.firestore().collection("otps").add({
        email,
        otp,
        expiration,
        used: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Send email
      if (transporter) {
        await transporter.sendMail({
          from: EMAIL_USER,
          to: email,
          subject: "MyVoice974 - Code de vérification",
          text: `Votre code est : ${otp}. Expire dans 5 minutes.`,
          html: `<p>Votre code est : <strong>${otp}</strong>. Expire dans 5 minutes.</p>`,
        });
        res.set("Access-Control-Allow-Origin", "*");
        return res.status(200).send({ success: true });
      } else {
        // Dev fallback when email creds not configured
        console.warn("[DEV] Email creds not set. OTP:", otp, "for", email);
        res.set("Access-Control-Allow-Origin", "*");
        return res.status(200).send({ success: true, dev: true });
      }
    } catch (error) {
      res.set("Access-Control-Allow-Origin", "*");
      if (error.code === "auth/user-not-found") {
        return res.status(404).send({ error: "Aucun compte trouvé avec cette adresse email." });
      }
      if (error.code === "auth/invalid-email") {
        return res.status(400).send({ error: "Adresse email invalide." });
      }
      res.status(500).send({ error: error.message || "Internal error" });
    }
  });
});

// Callable endpoint: send OTP (for clients using httpsCallable('sendOtp'))
exports.sendOtpCallable = onCall(async (request) => {
  const email = request.data?.email;
  if (!email) {
    throw new Error("Email is required.");
  }
  await admin.auth().getUserByEmail(email);
  const otp = generateOtp();
  const expiration = Date.now() + 5 * 60 * 1000;
  await admin.firestore().collection("otps").add({
    email,
    otp,
    expiration,
    used: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  if (transporter) {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: "MyVoice974 - Code de vérification",
      text: `Votre code est : ${otp}. Expire dans 5 minutes.`,
      html: `<p>Votre code est : <strong>${otp}</strong>. Expire dans 5 minutes.</p>`,
    });
    return { success: true };
  } else {
    console.warn("[DEV] Email creds not set. OTP:", otp, "for", email);
    return { success: true, dev: true };
  }
});

// Callable endpoint: verify OTP and reset password
exports.verifyOtpAndReset = onCall(async (request) => {
  const { email, otp, newPassword } = request.data || {};
  if (!email || !otp || !newPassword) {
    throw new Error("Missing required fields.");
  }
  // Lookup OTP doc
  const otpsRef = admin.firestore().collection("otps");
  const snapshot = await otpsRef
    .where("email", "==", email)
    .where("otp", "==", otp)
    .where("used", "==", false)
    .get();
  if (snapshot.empty) {
    throw new Error("Invalid or expired OTP.");
  }
  const otpDoc = snapshot.docs[0];
  const data = otpDoc.data();
  if (Date.now() > data.expiration) {
    throw new Error("OTP has expired.");
  }
  // Reset password
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().updateUser(user.uid, { password: newPassword });
  await otpDoc.ref.update({ used: true });
  return { success: true };
});
