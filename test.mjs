/* eslint-disable max-lines */
import assert from 'assert';
import { text, buffer } from 'node:stream/consumers';

import { chromium, firefox, webkit, expect } from '@playwright/test';

describe('Test Thresholdmann', () => {
  const browsers = [
    chromium,
    firefox,
    webkit
  ];

  browsers.forEach((browser) => {
    describe(`With ${browser.name()} browser`, () => {

      let page;
      let sdim;

      before(async function () {
        // eslint-disable-next-line no-invalid-this
        this.timeout(5000);
        browser = await browser.launch({headless: true});
        page = await browser.newPage();
        // page.on('console', (msg) => {
        //   console.log(`PAGE ${msg.type().toUpperCase()}: ${msg.text()}`);
        // });
        await page.setViewportSize({width: 1200, height: 800});
        await page.goto('http://127.0.0.1:8080');
      });

      after(async () => {
        await browser.close();
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
            assert.ok(msg.trim().startsWith('Choose a .nii.gz or a .nii file or drag it here.'));
          });

          it('init with test nifti file', async () => {
            const pathString = './img/bear_uchar.nii.gz';
            const fileChooserPromise = page.waitForEvent('filechooser');
            await page.click('#loadNifti');
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(pathString);
            await page.waitForSelector('.viewer');
            sdim = await page.evaluate(() => window.globals.mv.mri.s2v.sdim);
            assert.ok(Array.isArray(sdim));
            assert.strictEqual(sdim.length, 3);
          }).timeout(10000);
        });

        describe('can change slice', () => {
          it('check initial slice', async () => {
            const initialSlice = sdim[0] / 2 | 0;
            const slice = await page.evaluate(() => (
              window.globals.mv.views[0].slice
            ));
            assert.strictEqual(slice, initialSlice);
          });

          it('can change to another slice', async () => {
            const targetSlice = sdim[0] * 3 / 4 | 0;
            await page.evaluate((newSlice) => {
              const slider = document.querySelector('input.slice');
              slider.value = newSlice;
              slider.dispatchEvent(new Event('input', { bubbles: true }));
            }, targetSlice);
            const slice = await page.evaluate(() => (
              window.globals.mv.views[0].slice
            ));
            assert.strictEqual(slice, targetSlice);
          });
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

          it('when selecting the first point, the first threshold slider is selected', async () => {
            await page.click('#tools .mui[title="Select"]');
            const clickX = canvasBoundingBox.x + canvasBoundingBox.width / 2;
            const clickY = canvasBoundingBox.y + canvasBoundingBox.height / 2;
            await page.mouse.click(clickX, clickY);
            const firstSliderSelected = await page.$eval('#control-table tbody tr:nth-child(1)', (row) => row.classList.contains('selected'));
            const secondSliderSelected = await page.$eval('#control-table tbody tr:nth-child(2)', (row) => row.classList.contains('selected'));
            assert.strictEqual(firstSliderSelected, true);
            assert.strictEqual(secondSliderSelected, false);
          });

          it('when selecting the second point, the second threshold slider is selected', async () => {
            await page.click('#tools .mui[title="Select"]');
            const clickX = canvasBoundingBox.x + canvasBoundingBox.width * 2 / 3;
            const clickY = canvasBoundingBox.y + canvasBoundingBox.height * 2 / 3;
            await page.mouse.click(clickX, clickY);
            const firstSliderSelected = await page.$eval('#control-table tbody tr:nth-child(1)', (row) => row.classList.contains('selected'));
            const secondSliderSelected = await page.$eval('#control-table tbody tr:nth-child(2)', (row) => row.classList.contains('selected'));
            assert.strictEqual(firstSliderSelected, false);
            assert.strictEqual(secondSliderSelected, true);
          });

          it('when selecting the first threshold slider, the first point slice is displayed', async () => {
            await page.click('.axi-btn');
            await page.click('#control-table tbody tr:nth-child(1)  td:first-child');
            const sliderValue = await page.$eval('input.slice', (slider) => slider.value);
            const slice = await page.evaluate(() => (window.globals.mv.views[0].slice));
            assert.strictEqual(parseInt(sliderValue, 10), points[0][2]);
            assert.strictEqual(slice, points[0][2]);
          });

          it('when selecting the second threshold slider, the second point slice is displayed', async () => {
            await page.click('#control-table tbody tr:nth-child(2)  td:first-child');
            const sliderValue = await page.$eval('input.slice', (slider) => slider.value);
            const slice = await page.evaluate(() => (window.globals.mv.views[0].slice));
            assert.strictEqual(parseInt(sliderValue, 10), points[1][2]);
            assert.strictEqual(slice, points[1][2]);
          });

          it('can remove a point', async () => {
            await page.click('.sag-btn');
            await page.click('#tools .mui[title="Remove"]');
            const clickX = canvasBoundingBox.x + canvasBoundingBox.width * 2 / 3;
            const clickY = canvasBoundingBox.y + canvasBoundingBox.height * 2 / 3;
            await page.mouse.click(clickX, clickY);
            points = await page.evaluate(() => window.globals.points);
            assert.strictEqual(points.length, 1);
          });
        });

        describe('can adjust threshold', () => {
          it('check initial threshold', async () => {
            const initThreshold = await page.evaluate(() => (
              window.globals.values[0]
            ));
            assert.strictEqual(initThreshold, 127);
          });

          it('can adjust threshold with slider', async () => {
            const targetThreshold = 75;
            const sliderElement = await page.$('#control-table tbody tr:first-child td.slider-val input');
            await page.evaluate(({slider, value}) => {
              slider.value = value;
              slider.dispatchEvent(new Event('input', { bubbles: true }));
            }, {slider: sliderElement, value: targetThreshold.toString()});
            const newThreshold = await page.evaluate(() => (
              window.globals.values[0]
            ));
            assert.strictEqual(newThreshold, targetThreshold);
          });

          it('can adjust threshold with input', async () => {
            const targetThreshold = 125;
            const inputElement = await page.$('#control-table tbody tr:first-child td.text-val input');
            await inputElement.fill(String(targetThreshold));
            await inputElement.dispatchEvent('change');
            const newThreshold = await page.evaluate(() => (
              window.globals.values[0]
            ));
            assert.strictEqual(newThreshold, targetThreshold);
          });
        });

        describe('can adjust opacity, contrast and brightness', () => {
          it('check initial values', async () => {
            const {opacity, contrast, brightness} = await page.evaluate(() => ({
              opacity: window.globals.alpha,
              contrast: window.globals.contrast,
              brightness: window.globals.brightness
            }));

            assert.strictEqual(opacity, 0.5);
            assert.strictEqual(contrast, 1);
            assert.strictEqual(brightness, 1);
          });

          it('can adjust opacity', async () => {
            const targetOpacity = 40;
            await page.evaluate((opacity) => {
              const alphaSlider = document.querySelector('#image-adjust input[type="range"][oninput="changeAlpha(event)"]');
              alphaSlider.value = opacity;
              alphaSlider.dispatchEvent(new Event('input', { bubbles: true }));
            }, targetOpacity);
            const newOpacity = await page.evaluate(() => (
              window.globals.alpha
            ));
            assert.strictEqual(newOpacity, targetOpacity / 100);
          });

          it('can adjust contrast', async () => {
            const targetContrast = 80;
            await page.evaluate((contrast) => {
              const contrastSlider = document.querySelector('#image-adjust input[type="range"][oninput="changeContrast(event)"]');
              contrastSlider.value = contrast;
              contrastSlider.dispatchEvent(new Event('input', { bubbles: true }));
            }, targetContrast);
            const newContrast = await page.evaluate(() => (
              window.globals.contrast
            ));
            assert.strictEqual(newContrast, targetContrast / 100);
          });

          it('can adjust brightness', async () => {
            const targetBrightness = 120;
            await page.evaluate((brightness) => {
              const brightnessSlider = document.querySelector('#image-adjust input[type="range"][oninput="changeBrightness(event)"]');
              brightnessSlider.value = brightness;
              brightnessSlider.dispatchEvent(new Event('input', { bubbles: true }));
            }, targetBrightness);
            const newBrightness = await page.evaluate(() => (
              window.globals.brightness
            ));
            assert.strictEqual(newBrightness, targetBrightness / 100);
          });

        });

        describe('3D render', () => {
          let newPage;

          it('can open the 3D volume view window', async () => {
            const newPagePromise = page.context().waitForEvent('page');
            await page.click('#render3D');
            newPage = await newPagePromise;
            const newPageUrl = newPage.url();
            assert.strictEqual(newPageUrl, 'http://127.0.0.1:8080/render3D/index.html');
          }).timeout(5000);

        //   after(async () => {
        //     if (newPage) {
        //       await newPage.close();
        //     }
        //   });
        });

        describe('Saving', () => {
          it('Save Control Points', async () => {
            page.on('dialog', async (dialog) => {
              if (dialog.type() === 'prompt') {
                await dialog.accept();
              }
            });
            const downloadPromise = page.waitForEvent('download');
            await page.click('#saveControlPoints');
            const download = await downloadPromise;
            const readStream = await download.createReadStream();
            const downloadedJson = await text(readStream);
            const controlPoints = JSON.parse(downloadedJson);
            assert.deepStrictEqual(controlPoints, { points: [sdim.map((element) => element / 2 | 0)], values: [125] });
          });

          it('Save Mask', async () => {
            page.on('dialog', async (dialog) => {
              if (dialog.type() === 'prompt') {
                await dialog.accept();
              }
            });
            const downloadPromise = page.waitForEvent('download');
            await page.click('#saveMask');
            const download = await downloadPromise;
            const readStream = await download.createReadStream();
            const niftiBuffer = await buffer(readStream);

            // check that dowloaded nifti is a gzip file
            assert.deepStrictEqual(niftiBuffer.slice(0, 2), Buffer.from([0x1F, 0x8B]));
          }).timeout(10000);
        });

        describe('Loading', () => {
          it('Load Control Points', async () => {
            page.setDefaultTimeout(120000);
            const fileChooserPromise = page.waitForEvent('filechooser');
            await page.click('#loadControlPoints');
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles({
              name: 'control-points.json',
              mimeType: 'application/json',
              buffer: Buffer.from(JSON.stringify({ points: [[50, 50, 50]], values: [100]}), 'utf-8')
            });
            // wait for the new points to be loaded
            await expect(page.locator('#control-table tbody tr:first-child td.text-val input')).toHaveValue('100', { timeout: 15000 });
            const points = await page.evaluate(() => window.globals.points);
            const threshold = await page.evaluate(() => window.globals.values[0]);
            assert.strictEqual(points.length, 1);
            assert.deepStrictEqual(points, [[50, 50, 50]]);
            assert.strictEqual(threshold, 100);
          }).timeout(300000);
        });
      });
    });
  });
});

