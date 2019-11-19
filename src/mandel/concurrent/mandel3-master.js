/* -*- indent-tabs-mode: nil -*-
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var magFactor = 1.05;       // Magnification factor for each iteration
var maxIterations = 250;        // Set to 1 for a single frame

var workers = [];               // Array of web workers (threads)
var setupFailed = false;

var magnification,
  sync,
  slices,
  gridBytes;

function setupMain() {
  try {
    initStatus();

    var shmem = new SharedArrayBuffer(memSize);
    magnification = new Float64Array(shmem, magnification_OFFSET, 1);
    sync = new Int32Array(shmem, sync_OFFSET, Sync_INTS);
    slices = new Int32Array(shmem, slices_OFFSET, NumSlices * Slice_INTS);
    gridBytes = new Uint8Array(shmem, grid_OFFSET, Grid_BYTES);

    for (var ID = 0; ID < numWorkers; ID++) {
      workers[ID] = new Worker('mandel3-worker.js');
      workers[ID].onmessage = dispatchMessage;
      workers[ID].postMessage(['runWorker', shmem, ID]);
    }
  } catch (e) {
    setupFailed = true;
  }
}

var magLevel;                   // Current magnification level
var iterations;                 // Iteration counter
var timeBefore;                 // Time stamp before first frame

function startAnimation() {
  if (setupFailed) {
    return handleSetupFailed();
  }

  document.getElementById('startButton').onclick = stopAnimation;
  document.getElementById('startButton').value = 'Stop';
  magLevel = 1;
  iterations = 0;
  timeBefore = Date.now();
  initStatus();

  // Send these through shared memory to illustrate the principle.
  // The worker could compute the slice from the iteration number.

  var sliceHeight = Math.ceil(height / NumSlices);
  for (var i = 0; i < NumSlices; i++) {
    slices[i * Slice_INTS + Slice_ybase] = i * sliceHeight;
    slices[i * Slice_INTS + Slice_ylimit] = Math.min(height, (i + 1) * sliceHeight);
  }

  startFrame();
}

function stopAnimation() {
  document.getElementById('startButton').onclick = startAnimation;
  document.getElementById('startButton').value = 'Start';
  iterations = maxIterations;
  Atomics.store(sync, Sync_next, NumSlices);
}

var workersWorking;             // Number of workers still working

function startFrame() {
  workersWorking = numWorkers;
  magnification[0] = magLevel;
  Atomics.store(sync, Sync_next, 0);
  signalWorkAvailable();
}

function signalWorkAvailable() {
  for (var ID = 0; ID < numWorkers; ID++) {
    Atomics.store(sync, Sync_wait + ID, 1);
    Atomics.wake(sync, Sync_wait + ID, 1);
  }
}

function workerDone(id) {
  if (--workersWorking == 0) {
    displayFrame();
    if (++iterations < maxIterations) {
      magLevel *= magFactor;
      startFrame();
    } else {
      finishAnimation();
    }
  }
}

// Plumbing

function finishAnimation() {
  var time = Date.now() - timeBefore;
  status('Computing ' + maxIterations + ' frames' +
    '  Number of workers: ' + numWorkers +
    '  Compute time: ' + time + 'ms' +
    '  FPS: ' + Math.round(maxIterations / (time / 1000) * 10) / 10);
}

function initStatus() {
  status('Computing ' + maxIterations + ' frames' +
    '  Number of workers: ' + numWorkers);
}

var theCanvas,
  theStats;

function docInit() {
  document.body.onload = setupMain;
  document.getElementById('startButton').onclick = startAnimation;
  theCanvas = document.getElementById('theCanvas');
  theStats = document.getElementById('theStats');
}

function displayFrame() {
  canvasSetFromABGRBytes(theCanvas, gridBytes, height, width);
}

function status(msg) {
  theStats.textContent = msg;
}

function handleSetupFailed() {
  if (typeof SharedArrayBuffer == 'undefined') {
    alert('SharedArrayBuffer not found.\n\nEnable javascript.options.shared_memory in about:config, then reload this page.');
  } else {
    alert("Initialization failed for unknown reasons.\n\nThe demo requires Firefox 46 or later.");
  }
}

docInit();
