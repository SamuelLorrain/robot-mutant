import { Hash } from "./Hash";
import { PriorityQueueHash } from "./PriorityQueue";
import { Vec2D } from "./Vec2D";

export class Graph {
  private _edges: Map<Hash, Hash[]> = new Map();

  constructor(map: Map<Hash, Hash[]>) {
    this._edges = map;
  }

  public neighbors(location: Hash): Hash[] {
    const neighbors = this._edges.get(location);
    if (neighbors == null) {
      return [];
    }
    return neighbors;
  }

  public distance(begin: Hash, end: Hash): number {
    const v1 = Vec2D.unhash(begin);
    const v2 = Vec2D.unhash(end);
    const x = Math.abs(v2.x - v1.x) + Math.abs(v2.y - v1.y);
    return x;
  }

  public getPath(begin: Vec2D, end: Vec2D) {
    const prev = this._dijkstra(begin);
    const path = [];
    let current: Hash|undefined = end.hash();
    while (current && prev.get(current)) {
      path.push(current);
      current = prev.get(current);
    }
    return path.reverse();
  }

  private _dijkstra(begin: Vec2D): Map<Hash, Hash|undefined> {
    const queue = new PriorityQueueHash();
    const dist: Map<Hash, number> = new Map()
    const prev: Map<Hash, Hash|undefined> = new Map()
    const beginHash = begin.hash();
    dist.set(beginHash, 0);
    queue.enqueue(beginHash, 0);

    for (const k of this._edges.keys()) {
      if (k == beginHash) {
        continue;
      }
      prev.set(k, undefined);
      dist.set(k, Infinity);
    }

    while (!queue.empty()) {
      const [current,_] = queue.dequeue();
      for(const neighbor of this.neighbors(current)) {
        const alt = (dist.get(current) ?? 0) + this.distance(current, neighbor);
        if (alt < (dist.get(neighbor) ?? Infinity)) {
          prev.set(neighbor, current);
          dist.set(neighbor, alt);
          queue.enqueue(neighbor, alt);
        }
      }
    }

    return prev;
  }
}

