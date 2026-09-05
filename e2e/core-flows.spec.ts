import { expect, test } from "playwright/test"

test("search can be opened, navigated, and returns focus", async ({ page }) => {
  await page.goto("/")
  const searchButton = page.getByRole("button", { name: "Search Solandra" })
  await searchButton.focus()
  await page.keyboard.press("Control+k")
  const dialog = page.getByRole("dialog", { name: "Search Solandra" })
  await expect(dialog).toBeVisible()
  await page
    .getByRole("textbox", { name: "Search pages, docs and concepts" })
    .fill("quickstart")
  await expect(page.getByRole("option", { name: /Quickstart/i })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(searchButton).toBeFocused()
})

test("the slideshow exposes keyboard-accessible controls", async ({ page }) => {
  await page.goto("/viewAll")
  await expect(
    page.getByRole("img", { name: /generative artwork/i })
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Previous artwork" })
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Pause automatic slideshow" })
  ).toBeVisible()
  await expect(page.getByRole("button", { name: "Next artwork" })).toBeVisible()
})

test("export configuration validates dimensions and offers formats", async ({
  page,
}) => {
  await page.goto("/export?sketch=0&category=Highlights")
  await expect(
    page.getByRole("heading", { name: "Export artwork" })
  ).toBeVisible()
  await page.getByLabel("Format").selectOption("image/webp")
  await expect(page.getByText("Quality: 92%")).toBeVisible()
  await page.getByLabel("Width").fill("0")
  await expect(page.getByRole("alert")).toContainText("positive whole numbers")
  await expect(page.getByRole("button", { name: /Generate/ })).toBeDisabled()
})
