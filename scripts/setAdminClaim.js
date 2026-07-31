const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = require('../serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount),
});

async function main() {
  const [, , email, flag] = process.argv;

  if (!email || !flag || !['--grant', '--revoke'].includes(flag)) {
    console.error('Usage: node scripts/setAdminClaim.js <email> --grant|--revoke');
    process.exit(1);
  }

  try {
    const auth = getAuth();
    const user = await auth.getUserByEmail(email);
    const isGrant = flag === '--grant';

    await auth.setCustomUserClaims(user.uid, { admin: isGrant ? true : null });

    console.log(`${isGrant ? 'Granted' : 'Revoked'} admin claim for ${email} (uid: ${user.uid})`);
    console.log('Sign out and back in for the client to pick up the new claim.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to update custom claim:', error.message);
    process.exit(1);
  }
}

main();
