const { chromium } = require('playwright');

async function runAutomation(script) {
  let browser;
  let output = '';

  try {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Capture console logs
    page.on('console', (msg) => {
      output += `[${msg.type().toUpperCase()}] ${msg.text()}\n`;
      console.log(`[${msg.type()}] ${msg.text()}`);
    });

    // Capture errors
    page.on('pageerror', (error) => {
      output += `[ERROR] ${error.message}\n`;
      console.error(error);
    });

    // Execute the generated script
    const fn = new Function('page', 'browser', 'context', script);
    await fn(page, browser, context);

    await context.close();
    
    return { 
      success: true, 
      message: 'Automation completed successfully',
      output: output
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      output: output
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { runAutomation };