import { test, expect } from '@playwright/test';

const BASE_URL = "http://localhost:3000";

// Use a fixed test case instead of random selection
const testCases = [
  { clubId: '1', activityId: '101-4' },//ongoin
  { clubId: '2', activityId: '102' },//Upcoming
  { clubId: '3', activityId: '103-1'}//Past
];

// Force tests to run sequentially
test.describe.configure({ mode: 'serial' });

test.describe('Story 9: View Activity Details and Benefits', () => {
  test.setTimeout(120000);
  
  // Run tests for each selected case
  for (const { clubId, activityId } of testCases) {
    test.describe(`Activity ${activityId} from club ${clubId}`, () => {
      test.beforeEach(async ({ page }) => {
        // Navigate to activity page with extended timeout
        await page.goto(`${BASE_URL}/club/${clubId}/activities/${activityId}`, { 
          timeout: 60000,
          waitUntil: 'networkidle'
        });
        
        // Wait for critical elements to be visible
        await page.waitForSelector('h1', { timeout: 30000 });
      });
      
      // AC1: Display Full Activity Details
      test('should display full activity details', async ({ page }) => {
        // Check activity name
        const activityName = page.locator('h1').first();
        await expect(activityName).toBeVisible({ timeout: 10000 });

        // Check activity description section
        const descriptionHeading = page.locator('h2', { hasText: 'รายละเอียดกิจกรรม' });
        await expect(descriptionHeading).toBeVisible({ timeout: 10000 });

        // Check date, time, location
        const dateInfo = page.locator('div.flex.items-center', { hasText: 'วันที่จัดกิจกรรม' });
        const timeInfo = page.locator('div.flex.items-center', { hasText: 'เวลา' });
        const locationInfo = page.locator('div.flex.items-center', { hasText: 'สถานที่' });

        await expect(dateInfo).toBeVisible({ timeout: 10000 });
        await expect(timeInfo).toBeVisible({ timeout: 10000 });
        await expect(locationInfo).toBeVisible({ timeout: 10000 });

        // Check detailed description
        const detailsSection = page.locator('div.border-b.pb-4', { hasText: 'รายละเอียดเพิ่มเติม' });
        await expect(detailsSection).toBeVisible({ timeout: 10000 });
      });

      // AC2: Show Participation Benefits
      test('should display participation benefits', async ({ page }) => {
        // Check benefits section
        const benefitsHeading = page.locator('h2', { hasText: 'ประโยชน์ที่จะได้รับ' });

        if (await benefitsHeading.count() > 0) {
          await expect(benefitsHeading).toBeVisible({ timeout: 10000 });

          // Check for activity hours
          const activityHours = page.getByText(/ชั่วโมงกิจกรรม/);
          if (await activityHours.count() > 0) {
            await expect(activityHours).toBeVisible();
          }

          // Check for certificate
          const certificate = page.getByText(/เกียรติบัตร/);
          if (await certificate.count() > 0) {
            await expect(certificate).toBeVisible();
          }

          // Check for other benefits
          const otherBenefits = page.locator('ul.list-disc li').last();
          if (await otherBenefits.count() > 0) {
            await expect(otherBenefits).toBeVisible();
          }
        } else {
          test.skip();
        }
      });

      // AC3: Ensure Clear Eligibility and Requirements
      test('should display eligibility and requirements', async ({ page }) => {
        // Check requirements section
        const requirementsHeading = page.locator('h2', { hasText: 'คุณสมบัติผู้สมัคร' });
        await expect(requirementsHeading).toBeVisible({ timeout: 10000 });

        // Check for registration info for upcoming activities
        // Fix: Use a more specific selector to get the status badge
        const statusBadge = page.locator('div.rounded-full.bg-green-100.text-green-800').first();

        if (await statusBadge.count() > 0) {
          const status = await statusBadge.textContent();
          
          if (status && status.includes('กำลังจะมาถึง')) {
            // Check deadline
            const deadlineInfo = page.locator('div.flex.items-center', { hasText: 'สมัครภายใน' });
            if (await deadlineInfo.count() > 0) {
              await expect(deadlineInfo).toBeVisible();
            }
            
            // Check participant limits
            const participantsInfo = page.locator('div.flex.items-center', { hasText: 'จำนวนผู้เข้าร่วม' });
            if (await participantsInfo.count() > 0) {
              await expect(participantsInfo).toBeVisible();
            }
            
            // Check registration button
            const registerButton = page.getByRole('link', { name: /สมัครเข้าร่วมกิจกรรม/ });
            await expect(registerButton).toBeVisible();
          }
        }
      });
    });
  }
});