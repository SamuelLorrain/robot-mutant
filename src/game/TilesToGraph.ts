import { Graph } from "@/common/Graph";
import { Vec2D } from "@/common/Vec2D";
import { Hash } from "@/common/Hash";
import { Tile } from "./Tile";
import { Vec3D } from "@/common/Vec3D";

export const tiles3DToGraph2D = (tiles: Map<Hash, Tile>): Graph => {
  const tiles2D: Map<Hash, Tile> = new Map();

  for (const [k,v] of tiles.entries()) {
    const vec = Vec3D.unhash(k);
    tiles2D.set((new Vec2D(vec.x, vec.y)).hash(), v);
  }

  const map = new Map<Hash, Hash[]>();

  for (const [k, _] of tiles) {
    const vec = new Vec2D(Vec2D.unhash(k));

    const neighbours: Hash[] = [];
    const n = [
      new Vec2D(vec.x+1, vec.y),
      new Vec2D(vec.x-1, vec.y),
      new Vec2D(vec.x, vec.y+1),
      new Vec2D(vec.x, vec.y-1),
    ];

    for(const vec of n) {
      if (tiles2D.get(vec.hash())) {
        neighbours.push(vec.hash());
      }
    }

    map.set(vec.hash(), neighbours);
  }
  const graph = new Graph(map);
  return graph;
}
