import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';

let browser: Browser | null = null;

export class PlaywrightService {
  private context: BrowserContext | null = null;
  private screenshotDir = './screenshots';

  async initialize(headless = true) {
    if (!browser) {
      browser = await chromium.launch({
        headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
    this.context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) InkTrust/1.0',
    });
    return this.context;
  }

  async newPage(): Promise<Page> {
    if (!this.context) await this.initialize();
    return this.context!.newPage();
  }

  async navigate(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle'; timeout?: number }) {
    const page = await this.newPage();
    try {
      await page.goto(url, {
        waitUntil: options?.waitUntil ?? 'networkidle',
        timeout: options?.timeout ?? 30000,
      });
      return page;
    } catch (error) {
      await page.close();
      throw error;
    }
  }

  async fillForm(page: Page, selector: string, value: string) {
    await page.waitForSelector(selector, { timeout: 10000 });
    await page.fill(selector, value);
  }

  async clickAndWait(page: Page, selector: string, waitAfter = 2000) {
    await page.waitForSelector(selector, { timeout: 10000 });
    await page.click(selector);
    await page.waitForTimeout(waitAfter);
  }

  async searchProduct(page: Page, searchBoxSelector: string, query: string, submitSelector?: string) {
    await this.fillForm(page, searchBoxSelector, query);
    if (submitSelector) {
      await this.clickAndWait(page, submitSelector);
    } else {
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
    }
  }

  async takeScreenshot(page: Page, name: string) {
    const { mkdir } = await import('fs/promises');
    const { join } = await import('path');

    try {
      await mkdir(this.screenshotDir, { recursive: true });
    } catch { }

    const path = join(this.screenshotDir, `${name}-${Date.now()}.png`);
    await page.screenshot({ path, fullPage: true });
    return path;
  }

  async extractText(page: Page, selector: string) {
    await page.waitForSelector(selector, { timeout: 10000 });
    return page.textContent(selector);
  }

  async extractPrice(page: Page, selector: string): Promise<number | null> {
    const text = await this.extractText(page, selector);
    if (!text) return null;
    const match = text.replace(/[^0-9.]/g, '');
    return match ? parseFloat(match) : null;
  }

  async close(page?: Page) {
    if (page) await page.close();
  }

  async shutdown() {
    if (this.context) await this.context.close();
    this.context = null;
    if (browser) {
      await browser.close();
      browser = null;
    }
  }

  async confirmTransaction(page: Page, confirmationSelector: string, timeout = 30000) {
    await page.waitForSelector(confirmationSelector, { timeout });
    const text = await this.extractText(page, confirmationSelector);
    return text ?? 'confirmed';
  }

  async retry<T>(fn: () => Promise<T>, maxRetries = 3, delayMs = 2000): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries) throw error;
        await new Promise(r => setTimeout(r, delayMs * attempt));
      }
    }
    throw new Error('Retry exhausted');
  }
}

export const playwrightService = new PlaywrightService();
