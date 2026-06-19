const fs = require('fs');
const path = require('path');
const http = require('http');

const assets = [
  "6fea4762dc68a61ce36a89e5846e77253be35e51.png",
  "10dc229eeb96a4cabe5c251d305ef92ef93729fb.png",
  "41283939bd74a3453a06d1331bd20247bf8e8fcd.png",
  "34b6c149f3c5ab0ba816977fa7356cb327d3c695.png",
  "67f0e9cafad48b51ae943ed51f2c03b933ee477a.png",
  "b1c41062b620e92fe7726e0274f898671941126c.png",
  "47b1327b704ce6f68873f4bfd6d23ff098806982.png",
  "9e26891257a92e1efedb953ccda1b6d003f0894b.png",
  "251feb82890955089f33f0444a853122d80c9e0d.png",
  "0105aecbaaa703ae13644d8e3c7ac75390f947a9.png",
  "da03228ad1d2d05e464fe00db4b9fcdb842ee773.png",
  "d5ba096747838f29ae11487293a638d3704d43c6.png",
  "628d0b757003e98f9427c645354850f34e309611.png",
  "e2ab0b2b4fd4ec86e24ad6de94258101e4cc801c.png",
  "bc9f4d73718cbe673df90ed2e6bb1dd26e32b15c.png",
  "8bc9b95e8a1f1f4abae3f46cbcc40c6dba4b967d.png",
  "12513b5b3d234486e92be05984e1492f3fa635f2.png",
  "4e3542ad173e1c36958ace8998bf51f347470c4e.png",
  "2a6407cd3cafc78ace929f3f2b6291b61ad0603c.png",
  "83ee8974bc0726865bf381144c9e3d2e353d8317.png",
  "4d7146a3b6b4351a4ed6555a37ea662e6640e4f0.png",
  "0e95ea7680b1be37bf01a1c8bf22a56029fa21a7.png",
  "23ea9f77ca4de1459981e27a1c4bcd34d84057d0.png",
  "386700c0b6c1b042c85c64c0001eb60dd9c2b512.png",
  "42ffb1fd2303f89c19988e63d839950ff4417deb.png",
  "a2ab3bb8a0f5466bbe2bcab46a69f45a3aa32be7.png",
  "218df5a64ac50bbf60f7e96746b6928d9dd8e8c9.png",
  "186f19f99da670a0c87377b2f1b1c17233cb7e79.png",
  "ec1fd429d5a47b9f45735f34b25eff014d835a8b.png",
  "39e974e38ca5ad5a392cb39e57ca0e1605a1929e.png",
  "875428c385668a49d9dd8ba3cf81580739e3d7b7.png",
  "91fe9e72102bf97f7a0b2c6a1250358c294103ae.png",
  "926c7d07507269c9930e0831d14e40814dfd4624.png",
  "d8934db2edb89d909c9024a393947ea0d5717c7f.svg",
  "cb2b3c2a056037b1414b9c4101d75901244f6025.svg",
  "2f2d2ece128cb7b2c3437df1d30d9b3d42fdef1a.svg",
  "e0fccc4a5a15a0a464a3624c7b2011a6dc97bf66.svg",
  "5df991e802b393eae98b795ec8224436e23a83ee.svg",
  "e20336ec4bcab96f2d0ab607c450c4362f5a7e0c.svg",
  "d62a683fff14f65bdd7abec3b0763d27c4a2aa7c.svg",
  "f163754c26386ca6df9614b74e2e001a5a17faa8.svg",
  "b29bdca7b0d906be6831e45c00aafd77f911b307.svg",
  "dc2d5c9c091835f93a28fdbf94d8607207b7af36.svg",
  "ea171e5975821f07ba03309d4b02d25c0e21a76c.svg",
  "526a799f0177836f02f2792003e6f0b28b05cf31.svg",
  "74a4ab98b63a439b853c6b69665bff7bf87d40f0.svg",
  "66285d589432a0d984db3da463a27439fa343e0d.svg",
  "6364e84f25bbf1aef51f6487142d70da01db4533.svg",
  "915c16be1820c68d9f71acb298065812f199cc7f.svg",
  "0d8d7d83e8897409114ef9617868082a8140b01c.png",
  "50e9010954413189944b1d95aeeb4fc8ec584173.svg",
  "fed38479263ab8a1f0d96f0ab595f39a81e3a11d.svg",
  "49884239a314446dab233bc25c71ad0beaa209c0.svg",
  "b95dbd89564e67ccfb898e77b93ddda0264c741b.svg",
  "62a9753b0489238624dbe704ea3275fa3c3136b4.svg",
  "a0054e71be384840377b93433094c7275665ce6c.svg",
  "9b6d788fc27123342082b79f2475e1c17e08bb2a.svg"
];

const destDir = path.join(__dirname, 'public', 'assets');

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
}

console.log(`Downloading ${assets.length} assets to ${destDir}...`);

function download(filename) {
  return new Promise((resolve, reject) => {
    const fileUrl = `http://localhost:3845/assets/${filename}`;
    const filePath = path.join(destDir, filename);

    if (fs.existsSync(filePath)) {
      resolve();
      return;
    }

    const file = fs.createWriteStream(filePath);
    http.get(fileUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${filename}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function run() {
  let success = 0;
  let failed = 0;
  for (const asset of assets) {
    try {
      await download(asset);
      success++;
    } catch (e) {
      console.error(`Failed to download ${asset}: ${e.message}`);
      failed++;
    }
  }
  console.log(`Done! Success: ${success}, Failed: ${failed}`);
}

run();
