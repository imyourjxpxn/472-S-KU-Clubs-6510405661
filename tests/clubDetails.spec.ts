import { test, expect } from "@playwright/test";
import ClubInterface from "@/interfaces/Club";

const BASE = "http://localhost:3000";
const ID = "21";
const TARGET = BASE + "/club/" + ID + "/activities";

const ID_NO_COMMITTEE = "20";
const TARGET_NO_COMMITTEE = BASE + "/club/" + ID_NO_COMMITTEE + "/activities";

test.describe("[Story-4] Page Skeleton", () => {
  test("Display Loading Skeleton", async ({ page }) => {
    await page.goto(TARGET);

    //Skeleton
    const elements = page.locator(".skeleton");
    await expect(elements).toHaveCount(8);

    const allElements = await elements.all();
    for (const element of allElements) {
      await expect(element).toBeVisible();
    }
  });

  test("Hide Skeleton on Data Load", async ({ page }) => {
    await page.goto(TARGET);
    await page.waitForSelector(".content");

    //Content
    const content = page.locator(".content");
    await expect(content).toHaveCount(8);

    const allContent = await content.all();
    for (const element of allContent) {
      await expect(element).toBeVisible();
    }

    //Skeleton
    const skeleton = page.locator(".skeleton");
    await expect(skeleton).toHaveCount(0);

    const allSkeleton = await skeleton.all();
    for (const element of allSkeleton) {
      await expect(element).toBeHidden();
    }
  });

  test("Consistent User Experience", async ({ page }) => {
    await page.goto(TARGET);
    await page.waitForSelector(".content");

    await page.goto(BASE);
    await page.goto(TARGET);

    //Skeleton
    const elements = page.locator(".skeleton");
    await expect(elements).toHaveCount(8);

    const allElements = await elements.all();
    for (const element of allElements) {
      await expect(element).toBeVisible();
    }
  });
});

test.describe("[Story-5] Get club detail", () => {
  test("Display Club Details", async ({ page }) => {
    await page.goto(TARGET);
    await page.waitForSelector(".content");

    //Type
    const content = page.locator(".content").nth(3);
    await expect(content).toContainText("เทคโนโลยีและการพัฒนา");

    //Details
    const details = page.locator(".content").nth(6);
    await expect(details).toContainText("ชมรมเทคโนโลยีมุ่งเน้น");
  });

  test("Accurate Data", async ({ page }) => {
    try {
      //Use Fetch API to get data from the API
      const response = await fetch(`${BASE}/api/club/${ID}`);

      if (!response.ok) {
        throw new Error("API Error");
      }

      const club = (await response.json()) as ClubInterface;

      if (club) {
        await page.goto(TARGET);
        await page.waitForSelector(".content");

        // Type
        const content = page.locator(".content").nth(3);
        await expect(content).toContainText(club.clubType);

        // Details
        const details = page.locator(".content").nth(6);
        await expect(details).toContainText(club.aboutClub);
      } else {
        throw new Error("Club not found");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      throw new Error("An error occurred while fetching the data.");
    }
  });

  test("Show Join Option", async ({ page }) => {
    await page.goto(TARGET);
    await page.waitForSelector(".content");

    // Join Button
    const button = page.locator(".joinClubButton");
    await expect(button).toBeVisible();
    await button.click();

    //Toast
    const toast = page.locator(".toast-alert");
    await expect(toast).toContainText("เข้าร่วมสำเร็จ");
  });

  test.describe("[Story-6] View Club Member Profiles", () => {
    test("Display Club Core Team Section", async ({ page }) => {
      await page.goto(TARGET);
      await page.waitForSelector(".committee");

      const committee = page.locator(".committee");
      await expect(committee).toBeVisible();

      const allCommittee = await committee.all();

      await Promise.all(
        allCommittee.map(async (element, index) => {
          const image = committee.locator(".committee-avatar").nth(index);
          const name = committee.locator(".committee-name").nth(index);

          await expect(image).toBeVisible();
          await expect(name).toBeVisible();
        })
      );
    });

    test("No Leadership Data Available", async ({ page }) => {
      await page.goto(TARGET_NO_COMMITTEE);
      await page.waitForSelector(".committee");

      const committee = page.locator(".committee-404");
      await expect(committee).toBeVisible();
    });

    test("Mobile Responsiveness", async ({ page }) => {
      await page.goto(TARGET);
      await page.setViewportSize({ width: 375, height: 812 });

      //Content
      const content = page.locator(".content");
      await expect(content).toHaveCount(8);

      const allContent = await content.all();
      for (const element of allContent) {
        await expect(element).toBeVisible();
      }

      //Skeleton
      const skeleton = page.locator(".skeleton");
      await expect(skeleton).toHaveCount(0);

      const allSkeleton = await skeleton.all();
      for (const element of allSkeleton) {
        await expect(element).toBeHidden();
      }
    });
  });
});
