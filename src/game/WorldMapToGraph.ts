import { Graph } from "@/common/Graph";
import { WorldMap } from "./WorldMap";
import { Vec2D } from "@/common/Vec2D";
import { Hash } from "@/common/Hash";

export const worldMaptoGraph = (worldMap: WorldMap): Graph => {
  const map = new Map<Hash, Hash[]>();

  for (const [k, _] of worldMap.tile2D) {
    const vec = new Vec2D(Vec2D.unhash(k));

    const neighbours: Hash[] = [];
    const n = [
      new Vec2D(vec.x+1, vec.y),
      new Vec2D(vec.x-1, vec.y),
      new Vec2D(vec.x, vec.y+1),
      new Vec2D(vec.x, vec.y-1),
    ];

    for(const vec of n) {
      if (worldMap.tile2D.get(vec.hash())) {
        neighbours.push(vec.hash());
      }
    }

    map.set(vec.hash(), neighbours);
  }
  const graph = new Graph(map);
  return graph;
}
