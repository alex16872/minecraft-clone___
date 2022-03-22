import {
  maxHeight,
  Position,
  chunkSize,
  transparentBlocks,
  Chunks,
} from "../constants";
import {
  setLightValue,
  getSmallChunkCorner,
  computeVoxelIndex,
  addChunkForVoxel,
} from "../helpers";
import { expose } from "threads/worker";

function propagateSunlight(chunks: Chunks, queue: Position[]) {
  const floodLightQueue = [...queue] as Position[];
  while (queue.length > 0) {
    const [x, y, z] = queue.shift();
    const yBelow = y - 1;
    const blockBelowIndex = computeVoxelIndex([x, yBelow, z]);
    const { addedChunk: blockBelowChunk } = addChunkForVoxel(chunks, [
      x,
      yBelow,
      z,
    ]);
    const blockBelow = blockBelowChunk[blockBelowIndex];
    const belowIsTransparent = transparentBlocks.includes(blockBelow);
    const canPropagateSunlight = yBelow >= 0 && belowIsTransparent;
    if (canPropagateSunlight) {
      queue.push([x, yBelow, z]);
      setLightValue(chunks, [x, yBelow, z], 15);
    } else {
      floodLightQueue.push([x, y, z]);
    }
  }
  return floodLightQueue;
}

const sunlightWorker = {
  sunlightChunkColumnAt(pos: Position, chunks: Chunks) {
    const [cx, _, cz] = getSmallChunkCorner(pos);
    const queue = [] as Position[];
    for (let xOff = 0; xOff < chunkSize; xOff++) {
      for (let zOff = 0; zOff < chunkSize; zOff++) {
        const newPos = [xOff + cx, maxHeight + 20, zOff + cz] as Position;
        queue.push(newPos);
      }
    }
    // console.log("Queue after initializing sunlight: ", queue.length);
    const floodLightQueue = propagateSunlight(chunks, queue);
    return { floodLightQueue, sunlitChunks: chunks };
  },
};

expose(sunlightWorker);
