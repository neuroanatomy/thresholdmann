import assert from 'assert';

import puppeteer from 'puppeteer';

describe('Test Thresholdmann', () => {
  let browser, page;
  let sdim;

  before(async function () {
    // eslint-disable-next-line no-invalid-this
    this.timeout(5000);
    browser = await puppeteer.launch({ headless: 'new' });
    page = await browser.newPage();
    // page.on('console', (msg) => {
    //   console.log(`PAGE ${msg.type().toUpperCase()}: ${msg.text()}`);
    // });
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto('http://127.0.0.1:8080');
  });

  describe('Unit tests', () => {
    describe('Trivial test', () => {
      it('should say hey', async () => {
        const res = await page.evaluate(() => window.location);
        assert.ok(res.origin);
      });
    });
  });

  describe('End to end tests', () => {
    describe('Load a file', () => {
      it('should display title', async () => {
        const title = await page.evaluate(() => document.title);
        assert.strictEqual(title, 'Thresholdmann');
      });
      it('should display "Choose..." message', async () => {
        const msg = await page.evaluate(() => document.querySelector('.box_input').innerText);
        assert.strictEqual(msg, '\nChoose a .nii.gz or a .nii file or drag it here.');
      });
      it('init with test nifti file', async () => {
        const pathString = './img/bear_uchar.nii.gz';
        sdim = await page.evaluate(async (path) => {
          await window.initWithPath(path);

          return window.globals.mv.mri.s2v.sdim;
        }, pathString);
        assert.ok(Array.isArray(sdim));
        assert.strictEqual(sdim.length, 3);
      }).timeout(5000);
    });

    describe('can switch planes', () => {
      it('can switch to coronal plane', async () => {
        await page.click('.cor-btn');
        const plane = await page.evaluate(() => window.globals.mv.views[0].plane);
        assert.strictEqual(plane, 'cor');
      });
      it('can switch to axial plane', async () => {
        await page.click('.axi-btn');
        const plane = await page.evaluate(() => window.globals.mv.views[0].plane);
        assert.strictEqual(plane, 'axi');
      });
      it('can switch to sagittal plane', async () => {
        await page.click('.sag-btn');
        const plane = await page.evaluate(() => window.globals.mv.views[0].plane);
        assert.strictEqual(plane, 'sag');
      });
    });

    describe('can change settings', () => {
      it('change threshold direction to down', async () => {
        await page.click('#direction .mui[title="SelectDown"]');
        const direction = await page.evaluate(() => window.globals.selectedDirection);
        assert.strictEqual(direction, 'SelectDown');
      });
      it('change threshold direction to up', async () => {
        await page.click('#direction .mui[title="SelectUp"]');
        const direction = await page.evaluate(() => window.globals.selectedDirection);
        assert.strictEqual(direction, 'SelectUp');
      });
      it('switch to threshold value view', async () => {
        await page.click('#overlay .mui[title="Threshold Value"]');
        const overlay = await page.evaluate(() => window.globals.selectedOverlay);
        assert.strictEqual(overlay, 'Threshold Value');
      });
      it('switch to threshold mask view', async () => {
        await page.click('#overlay .mui[title="Threshold Mask"]');
        const overlay = await page.evaluate(() => window.globals.selectedOverlay);
        assert.strictEqual(overlay, 'Threshold Mask');
      });
    });

    describe('can manage points', () => {
      let canvasBoundingBox;
      let points;
      it('check initial point', async () => {
        canvasBoundingBox = await page.evaluate(() => {
          const { x, y, width, height } = document.querySelector('.viewer').getBoundingClientRect();

          return { x, y, width, height };
        });
        points = await page.evaluate(() => window.globals.points);
        assert.strictEqual(points.length, 1);
        // point is in the middle
        assert.ok(points[0].every((v, i) => v === Math.floor(sdim[i] / 2)));
      });
      it('can add a point', async () => {
        await page.click('#tools .mui[title="Add"]');
        const clickX = canvasBoundingBox.x + canvasBoundingBox.width / 3;
        const clickY = canvasBoundingBox.y + canvasBoundingBox.height / 3;
        await page.mouse.click(clickX, clickY);
        points = await page.evaluate(() => window.globals.points);
        assert.strictEqual(points.length, 2);
        assert.ok(points[0][0] === points[1][0]);
        assert.ok(points[0][1] > points[1][1]);
        assert.ok(points[0][2] < points[1][2]);
      });
      it('can move a point', async () => {
        await page.click('#tools .mui[title="Move"]');
        const startX = canvasBoundingBox.x + canvasBoundingBox.width / 3;
        const startY = canvasBoundingBox.y + canvasBoundingBox.height / 3;
        const endX = canvasBoundingBox.x + canvasBoundingBox.width * 2 / 3;
        const endY = canvasBoundingBox.y + canvasBoundingBox.height * 2 / 3;
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(endX, endY);
        await page.mouse.up();
        points = await page.evaluate(() => window.globals.points);
        assert.strictEqual(points.length, 2);
        assert.ok(points[0][0] === points[1][0]);
        assert.ok(points[0][1] < points[1][1]);
        assert.ok(points[0][2] > points[1][2]);
      });
      it('can remove a point', async () => {
        await page.click('#tools .mui[title="Remove"]');
        const clickX = canvasBoundingBox.x + canvasBoundingBox.width * 2 / 3;
        const clickY = canvasBoundingBox.y + canvasBoundingBox.height * 2 / 3;
        await page.mouse.click(clickX, clickY);
        points = await page.evaluate(() => window.globals.points);
        assert.strictEqual(points.length, 1);
      });
    });
  });
});

