
import axios from "axios";
import * as fs from "fs";
import * as path from "path";

async function runIntegrationTest() {
  console.log("🧪 Starting Integration Test: Circle-to-Approve...");

  const imageDir = "/Users/s/.gemini/antigravity/brain/df569bed-3b2d-4026-aace-1e20368c95f7";
  const files = fs.readdirSync(imageDir);
  const imageFile = files.find(f => f.startsWith("fax_approval_circle_test") && f.endsWith(".png"));

  if (!imageFile) {
    console.error("Test image not found!");
    process.exit(1);
  }

  const imagePath = path.join(imageDir, imageFile);
  const imageBase64 = fs.readFileSync(imagePath).toString("base64");

  try {
    console.log("Sending AI Analysis request to local server (Port 3001)...");
    const response = await axios.post("http://localhost:3001/api/v1/ai/analyze", {
      imageBase64,
      mimeType: "image/png",
      faxId: "D8w7y2m9VywSfAMG48dgiroienfrX419wjESVxPyv4sR"
    });

    const data = response.data;
    console.log("✅ API Response Received:");
    console.log(JSON.stringify(data, null, 2));

    if (data.circle_detected === "APPROVE") {
      console.log("✅ SUCCESS: Circle detected by server!");
    } else {
      console.warn("❌ FAILED: Circle not detected.");
    }

    if (data.solana_action && data.solana_action.blink_url) {
      console.log("✅ SUCCESS: Solana Blink URL generated!");
      console.log(`🔗 Link: ${data.solana_action.blink_url}`);
    } else {
      console.warn("❌ FAILED: Solana action not generated.");
    }

  } catch (error: any) {
    console.error("❌ Test Failed:", error.response?.data || error.message);
  }
}

runIntegrationTest();
