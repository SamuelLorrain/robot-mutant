import { Hash } from "./Hash";
import { PriorityQueueHash } from "./PriorityQueue";
import { Vec2D } from "./Vec2D";

export class Graph {
  private _edges: Map<Hash, Hash[]> = new Map();

  constructor(map: Map<Hash, Hash[]>) {
    this._edges = map;
  }

  public has(node: Hash): boolean {
    return this._edges.get(node) != null;
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
    const prev = this.dijkstra(begin);
    const path = [];
    let current: Hash|undefined = end.hash();
    while (current && (prev.get(current) || current == begin.hash())) {
      path.push(current);
      current = prev.get(current);
    }
    return path.map(Vec2D.unhash).reverse();
  }

  public dijkstra(begin: Vec2D, obstacles_: Set<Hash>|null = null): Map<Hash, Hash|undefined> {
    const obstacles = obstacles_ ?? new Set();
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
        let alt: number;
        if (obstacles.has(current)) {
          alt = Infinity;
        } else {
          alt = (dist.get(current) ?? 0) + this.distance(current, neighbor);
        }
        if (alt < (dist.get(neighbor) ?? Infinity)) {
          prev.set(neighbor, current);
          dist.set(neighbor, alt);
          queue.enqueue(neighbor, alt);
        }
      }
    }
    for(const o of obstacles) {
      prev.delete(o);
    }
    return prev;
  }
}

