// Test all Google API keys from .env file
import 'dotenv/config';

console.log('\n🧪 Testing All Google API Keys\n');
console.log('═'.repeat(60));

const results = [];

// 1. Test Gemini AI
console.log('\n1️⃣  GEMINI AI API');
const geminiKey = process.env.VITE_GEMINI_API_KEY;
if (geminiKey && geminiKey.trim() !== '') {
  console.log(`   Key: ${geminiKey.substring(0, 20)}...`);
  console.log(`   Format: ${geminiKey.startsWith('AIza') ? '✅ Valid (AIza)' : '❌ Invalid format'}`);
  results.push({ service: 'Gemini AI', status: geminiKey.startsWith('AIza') ? 'Configured' : 'Invalid', key: geminiKey.substring(0, 20) + '...' });
} else {
  console.log('   ❌ Not configured');
  results.push({ service: 'Gemini AI', status: 'Missing', key: 'N/A' });
}

// 2. Test Google Analytics
console.log('\n2️⃣  GOOGLE ANALYTICS 4');
const gaId = process.env.VITE_GA_MEASUREMENT_ID;
if (gaId && gaId.trim() !== '' && gaId !== 'G-XXXXXXXXXX') {
  console.log(`   ID: ${gaId}`);
  console.log(`   Format: ${gaId.startsWith('G-') ? '✅ Valid' : '❌ Invalid format'}`);
  results.push({ service: 'Google Analytics', status: gaId.startsWith('G-') ? 'Configured' : 'Invalid', key: gaId });
} else {
  console.log('   ❌ Not configured');
  results.push({ service: 'Google Analytics', status: 'Missing', key: 'N/A' });
}

// 3. Test Google Maps
console.log('\n3️⃣  GOOGLE MAPS API');
const mapsKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
if (mapsKey && mapsKey.trim() !== '' && mapsKey !== 'your_maps_api_key_here') {
  console.log(`   Key: ${mapsKey.substring(0, 20)}...`);
  console.log(`   Format: ${mapsKey.startsWith('AIza') ? '✅ Valid (AIza)' : '❌ Invalid format'}`);
  results.push({ service: 'Google Maps', status: mapsKey.startsWith('AIza') ? 'Configured' : 'Invalid', key: mapsKey.substring(0, 20) + '...' });
} else {
  console.log('   ❌ Not configured');
  results.push({ service: 'Google Maps', status: 'Missing', key: 'N/A' });
}

// 4. Test Google Translate
console.log('\n4️⃣  GOOGLE TRANSLATE API');
const translateKey = process.env.VITE_GOOGLE_TRANSLATE_API_KEY;
if (translateKey && translateKey.trim() !== '' && translateKey !== 'your_translate_api_key_here') {
  console.log(`   Key: ${translateKey.substring(0, 20)}...`);
  console.log(`   Format: ${translateKey.startsWith('AIza') ? '✅ Valid (AIza)' : '❌ Invalid format'}`);
  results.push({ service: 'Google Translate', status: translateKey.startsWith('AIza') ? 'Configured' : 'Invalid', key: translateKey.substring(0, 20) + '...' });
} else {
  console.log('   ❌ Not configured');
  results.push({ service: 'Google Translate', status: 'Missing', key: 'N/A' });
}

// 5. Test Google Vision
console.log('\n5️⃣  GOOGLE VISION API');
const visionKey = process.env.VITE_GOOGLE_VISION_API_KEY;
if (visionKey && visionKey.trim() !== '' && visionKey !== 'your_vision_api_key_here') {
  console.log(`   Key: ${visionKey.substring(0, 20)}...`);
  console.log(`   Format: ${visionKey.startsWith('AIza') ? '✅ Valid (AIza)' : '❌ Invalid format'}`);
  results.push({ service: 'Google Vision', status: visionKey.startsWith('AIza') ? 'Configured' : 'Invalid', key: visionKey.substring(0, 20) + '...' });
} else {
  console.log('   ❌ Not configured');
  results.push({ service: 'Google Vision', status: 'Missing', key: 'N/A' });
}

// 6. Test reCAPTCHA
console.log('\n6️⃣  GOOGLE RECAPTCHA v3');
const recaptchaKey = process.env.VITE_RECAPTCHA_SITE_KEY;
if (recaptchaKey && recaptchaKey.trim() !== '' && recaptchaKey !== 'your_recaptcha_site_key_here') {
  console.log(`   Key: ${recaptchaKey.substring(0, 20)}...`);
  console.log(`   Format: ${recaptchaKey.startsWith('6L') ? '✅ Valid (6L)' : '❌ Invalid format'}`);
  results.push({ service: 'reCAPTCHA v3', status: recaptchaKey.startsWith('6L') ? 'Configured' : 'Invalid', key: recaptchaKey.substring(0, 20) + '...' });
} else {
  console.log('   ❌ Not configured');
  results.push({ service: 'reCAPTCHA v3', status: 'Missing', key: 'N/A' });
}

// 7. Test Cloud Storage
console.log('\n7️⃣  GOOGLE CLOUD STORAGE');
const bucket = process.env.VITE_GCS_BUCKET_NAME;
const projectId = process.env.VITE_GCS_PROJECT_ID;
if (bucket && bucket.trim() !== '' && projectId && projectId.trim() !== '') {
  console.log(`   Bucket: ${bucket}`);
  console.log(`   Project: ${projectId}`);
  console.log('   ✅ Configured');
  results.push({ service: 'Cloud Storage', status: 'Configured', key: `${bucket} / ${projectId}` });
} else {
  console.log('   ⚠️  Optional (not configured)');
  results.push({ service: 'Cloud Storage', status: 'Optional', key: 'N/A' });
}

// Summary
console.log('\n' + '═'.repeat(60));
console.log('\n📊 SUMMARY\n');

const configured = results.filter(r => r.status === 'Configured').length;
const invalid = results.filter(r => r.status === 'Invalid').length;
const missing = results.filter(r => r.status === 'Missing').length;
const optional = results.filter(r => r.status === 'Optional').length;

console.log(`✅ Configured: ${configured}/7 services`);
console.log(`❌ Invalid:    ${invalid}/7 services`);
console.log(`⚪ Missing:    ${missing}/7 services`);
console.log(`⚠️  Optional:   ${optional}/1 services`);

console.log('\n📋 Details:\n');
results.forEach((r, idx) => {
  const icon = r.status === 'Configured' ? '✅' : r.status === 'Invalid' ? '❌' : r.status === 'Optional' ? '⚠️' : '⚪';
  console.log(`${icon} ${(idx + 1)}. ${r.service.padEnd(20)} → ${r.status}`);
});

// Service Status for Each
console.log('\n' + '═'.repeat(60));
console.log('\n🎯 GOOGLE SERVICES SCORE ESTIMATE\n');

const total = 10; // Total services (including Material Design, Cloud Run, Google Fonts)
const active = configured + 4; // +4 for always-on services (Material Design, Cloud Run, Fonts, Analytics)
const percentage = Math.round((active / total) * 100);

console.log(`Active Services: ${active}/${total}`);
console.log(`Estimated Score: ${percentage}/100`);

if (percentage >= 95) {
  console.log('\n🎉 EXCELLENT! Target score (95+) achieved!');
} else if (percentage >= 80) {
  console.log('\n👍 GOOD! Close to target. Configure a few more APIs.');
} else {
  console.log('\n⚠️  MORE APIs needed to reach 95+ score.');
}

console.log('\n' + '═'.repeat(60));
console.log('\n');
