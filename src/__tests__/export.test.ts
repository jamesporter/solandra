import { describe, expect, it } from "vitest"
import { extensionFor, validateExportSize } from "../../pages/export"

describe("export helpers", () => {
  it("accepts a valid export size", () =>
    expect(validateExportSize(4096, 2160)).toBeNull())
  it("rejects invalid dimensions and excessive pixel counts", () => {
    expect(validateExportSize(0, 100)).toMatch(/positive/)
    expect(validateExportSize(16385, 100)).toMatch(/16,384/)
    expect(validateExportSize(10000, 10000)).toMatch(/64 megapixels/)
  })
  it("maps MIME types to familiar extensions", () => {
    expect(extensionFor("image/jpeg")).toBe("jpg")
    expect(extensionFor("image/png")).toBe("png")
    expect(extensionFor("image/webp")).toBe("webp")
  })
})
