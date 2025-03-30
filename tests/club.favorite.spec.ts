import fs from 'fs/promises';
import { test, expect } from '@playwright/test';
import path from 'path';
import Club from '@/interfaces/Club';

const BASE_URL = "http://localhost:3000";
const FAV_PAGE_URL = BASE_URL + "/favorite-clubs";

const getClubs = async () => {
    try {
        const filePath = path.join(process.cwd(), "data/clubs.json");
        const fileData = await fs.readFile(filePath, "utf-8");

        if (!fileData) {
            throw new Error("ไม่พบไฟล์ .json ข้อมูลองค์กรนิสิต");
        }

        const clubs = JSON.parse(fileData) as Club[];

        return clubs;
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        throw new Error("เกิดข้อผิดพลาดในการค้นหาองค์กรนิสิต");
    }
}

test.describe('[Stroy-10] Farvorite Clubs UI', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(FAV_PAGE_URL);

        // Set favorite clubs to local storage
        await page.evaluate(() => {
            localStorage.setItem("favoriteClub-1", "true");
            localStorage.setItem("favoriteClub-2", "true");
            localStorage.setItem("favoriteClub-3", "true");
        });
    })

    test('See Loading Skeleton', async ({ page }) => {
        await expect(page.locator('[data-testid="skeleton"]').first()).toBeVisible();

        await page.waitForTimeout(2000)

        await expect(page.locator('[data-testid="skeleton"]')).toBeHidden();
    });

    test('Get Club Data', async ({ page }) => {
        await page.waitForSelector('[data-testid="clubBox"]' );

        const clubBox = page.locator('[data-testid="clubBox"]').all();

        for (let id = 0; id < (await clubBox).length; id++) {
            const club = (await clubBox)[id];

            await expect(club).toBeVisible
        }
    });

    test('View Favorite clubs', async ({ page }) => {
        await page.waitForSelector('[data-testid="clubBox"]');

        const clubBox = page.locator('[data-testid="clubBox"]').all();
        
        for (let id = 0; id < (await clubBox).length; id++) {
            const club = (await clubBox)[id];

            await expect(club).toBeVisible();
        }

        const favBtn = (await clubBox)[0].locator('[data-testid="favBtn"]');
        await favBtn.click();
        
        await expect(page.locator('[data-testid="clubBox"]')).toBeHidden();
    });
});

const MAIN_PAGE_URL = BASE_URL + "/";

test.describe('[Story-11] Update Favorite Clubs List', () => {
    test("Add Club to Favorites", async ({ page }) => {
        await page.goto(MAIN_PAGE_URL);
        await page.waitForSelector('[data-testid="clubBox"]');

        const clubBoxs = page.locator('[data-testid="clubBox"]').all();
        await expect((await clubBoxs).length).toBeGreaterThan(0);

        for (let i = 0; i < 3; i++) {
            const clubBox = (await clubBoxs)[i];
            const favBtn = clubBox.locator('[data-testid="favBtn"]');
            await favBtn.click();
        }
        
        // Add favorite club to local storage
        await page.evaluate(() => {
            localStorage.setItem("favoriteClub-1", "true");
        });

        // Go to favorite page
        await page.goto(FAV_PAGE_URL);
        await page.waitForSelector('[data-testid="clubBox"]');

        // Check if the club is in the favorite list
        const favClubBoxs = page.locator('[data-testid="clubBox"]').all();
        await expect((await favClubBoxs).length).toBeGreaterThan(0);
    });

    test("Remove Club from Favorites", async ({ page }) => {
        // Add favorite club to local storage
        await page.goto(FAV_PAGE_URL);
        await page.evaluate(() => {
            localStorage.setItem("favoriteClub-1", "true");
            localStorage.setItem("favoriteClub-2", "true");
        });
        await page.waitForSelector('[data-testid="clubBox"]');

        const clubBoxs = page.locator('[data-testid="clubBox"]').all();
        await expect((await clubBoxs).length).toBeGreaterThan(0);

        // Select the first club box
        const clubBox = (await clubBoxs)[0];
        const favBtn = clubBox.locator('[data-testid="favBtn"]');
        await favBtn.click();
        
        // Remove favorite club from local storage
        await page.evaluate(() => {
            localStorage.removeItem("favoriteClub-1");
        });

        await expect(clubBox).toBeHidden();
    });

    test("View Favorite Clubs", async ({ page }) => {
        // Add favorite club to local storage
        await page.goto(FAV_PAGE_URL);
        await page.evaluate(() => {
            localStorage.setItem("favoriteClub-1", "true");
            localStorage.setItem("favoriteClub-2", "true");
        });
        await page.waitForSelector('[data-testid="clubBox"]');

        const clubBoxs = page.locator('[data-testid="clubBox"]').all();
        await expect((await clubBoxs).length).toBeGreaterThan(0);

        // Select the first club box
        const clubBox = (await clubBoxs)[0];
        const favBtn = clubBox.locator('[data-testid="favBtn"]');
        await favBtn.click();
        
        // Remove favorite club from local storage
        await page.evaluate(() => {
            localStorage.removeItem("favoriteClub-1");
        });

        // The club box should be disappeared
        await expect(clubBox).toBeHidden();

        // Visit their favorite detail page
        await page.goto(`${BASE_URL}/club/2/activities`);
        await page.waitForSelector('h1');
        await expect(page.locator('h1')).toBeVisible();
    });
})

test.describe('[Story-12] Load Saved Clubs', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(FAV_PAGE_URL);

        // Set favorite clubs to local storage
        await page.evaluate(() => {
            localStorage.setItem("favoriteClub-1", "true");
            localStorage.setItem("favoriteClub-2", "true");
            localStorage.setItem("favoriteClub-3", "true");
        })
    });

    test('Display Saved Clubs', async ({ page }) => { 
        await page.waitForSelector('[data-testid="clubBox"]');

        const clubBoxs = page.locator('[data-testid="clubBox"]').all();
        await expect((await clubBoxs).length).toBeGreaterThan(0);

        for (let i = 0; i < (await clubBoxs).length; i++) {
            const clubBox = (await clubBoxs)[i];
            
            const hasName = clubBox.getByText(/ชมรม/);
            const hasTags = clubBox.getByText(/#(\w+)/);
            
            await expect(hasName && hasTags).toBeTruthy();
        }
    });

    test('Empty Saved Clubs', async ({ page }) => {
        await page.evaluate(() => {
            localStorage.clear();
        });

        await page.reload();
        
        await expect(page.locator('[data-testid="clubBox"]').nth(0)).toBeHidden();
    });

    test('Clickable Club Details', async ({ page }) => {
        await page.waitForSelector('[data-testid="clubBox"]');

        const clubBoxs = page.locator('[data-testid="clubBox"]').all();
        await expect((await clubBoxs).length).toBeGreaterThan(0);

        const clubBox = (await clubBoxs)[0];
        const clubName = clubBox.getByText(/ดูรายละเอียด/);
        await clubName.click();
        
        // Redirect to club detail page
        await page.waitForSelector('h1');
        await expect(page.locator('h1')).toBeVisible();
    })
})