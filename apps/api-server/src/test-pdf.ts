
import { telnyxFaxOutService } from "./services/telnyx/fax-out";
import * as fs from "fs";
import * as path from "path";

async function testPdf() {
  console.log("📄 Testing Real PDF Generation...");
  
  const receiptData = {
    faxId: "test-fax-123",
    amount: 5680,
    merchant: "Olive Pharmacy",
    status: "APPROVED"
  };

  try {
    const pdfBuffer = await telnyxFaxOutService.generateReceiptPdf({
      ...receiptData,
      from: "InkTrust System",
      to: "+81300000000",
      timestamp: new Date()
    });

    const outputPath = path.join(__dirname, "test-receipt.pdf");
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`✅ SUCCESS: Real PDF generated at ${outputPath}`);
    console.log(`PDF Size: ${pdfBuffer.length} bytes`);
  } catch (error) {
    console.error("❌ PDF Generation Failed:", error);
  }
}

testPdf();
