import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Manual Tracking Logic Validation", () => {
  function cleanTrackingNumber(raw: string): string {
    return (raw || "").trim().replace(/\s+/g, "").toUpperCase();
  }

  function isUpuStandard(trackingNumber: string): boolean {
    return /^[A-Z]{2}\d{9}ID$/.test(trackingNumber);
  }

  it("should strip whitespace and convert tracking number to uppercase", () => {
    assert.equal(cleanTrackingNumber("  ee 123 456 789 id  "), "EE123456789ID");
    assert.equal(cleanTrackingNumber("pos-12345"), "POS-12345");
    assert.equal(cleanTrackingNumber("   cp987654321id   "), "CP987654321ID");
  });

  it("should correctly identify standard UPU Pos Indonesia format", () => {
    // Valid UPU formats (2 letters + 9 digits + ID)
    assert.equal(isUpuStandard("EE123456789ID"), true);
    assert.equal(isUpuStandard("CP987654321ID"), true);
    assert.equal(isUpuStandard("RR112233445ID"), true);

    // Non-UPU formats (should return false but remain allowed in system with warning)
    assert.equal(isUpuStandard("123456789"), false);
    assert.equal(isUpuStandard("EE12345678ID"), false); // only 8 digits
    assert.equal(isUpuStandard("EE123456789US"), false); // ends in US
    assert.equal(isUpuStandard("EMS123456789ID"), false); // 3 letters
  });

  it("should reject empty tracking string", () => {
    assert.equal(cleanTrackingNumber("   "), "");
    assert.equal(cleanTrackingNumber(""), "");
  });
});
