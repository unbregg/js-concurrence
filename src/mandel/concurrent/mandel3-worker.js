/* -*- indent-tabs-mode: nil -*-
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

importScripts("utilities.js", "mandel3-shared.js", "mandelbrot.js");

onmessage = dispatchMessage;

var magnification, sync, slices, grid;

function runWorker(shmem, ID) {
  // Variables in shared memory
  magnification = new Float64Array(shmem, magnification_OFFSET, 1);
  sync          = new Int32Array(shmem, sync_OFFSET, Sync_INTS);
  slices        = new Int32Array(shmem, slices_OFFSET, NumSlices * Slice_INTS);
  grid          = new Int32Array(shmem, grid_OFFSET, Grid_INTS);

  for (;;) {
    waitForWork(ID);
    var idx;
    while ((idx = Atomics.load(sync, Sync_next)) < NumSlices) {
      Atomics.compareExchange(sync, Sync_next, idx, idx+1)
      var ybase  = slices[idx * Slice_INTS + Slice_ybase];
      var ylimit = slices[idx * Slice_INTS + Slice_ylimit];
      if(magnification[0] === 1 && ID === 1) {
        console.log('111')
      }
      mandelbrot(grid, ybase, ylimit, magnification[0]);
    }
    postMessage(["workerDone"]);
  }
}

function waitForWork(ID) {
  Atomics.wait(sync, Sync_wait + ID, 0);
  Atomics.store(sync, Sync_wait + ID, 0);
}
