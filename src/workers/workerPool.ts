import { spawn, Pool } from "threads";

export const chunkGeometryWorkerPool = Pool(
  () =>
    spawn(
      new Worker(new URL("./chunkGeometryWorker.ts", import.meta.url), {
        name: "fibonacci",
        type: "module",
        /* webpackEntryOptions: { filename: "workers/[name].js" } */
      })
    ),
  8
);

export const sunlightWorkerPool = Pool(
  () =>
    spawn(
      new Worker(new URL("./sunlightWorker.ts", import.meta.url), {
        name: "fibonacci",
        type: "module",
        /* webpackEntryOptions: { filename: "workers/[name].js" } */
      })
    ),
  8
);

export const floodLightWorkerPool = Pool(
  () =>
    spawn(
      new Worker(new URL("./floodLightWorker.ts", import.meta.url), {
        name: "fibonacci",
        type: "module",
        /* webpackEntryOptions: { filename: "workers/[name].js" } */
      })
    ),
  8
);
