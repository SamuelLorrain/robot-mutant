import { GraphException } from "./exceptions";
import { Hash } from "./Hash";
import { PriorityQueueHash } from "./PriorityQueue";
import { Queue } from "./Queue";

export class Graph {
  private _edges: Map<Hash, Hash[]> = new Map();

  constructor(map: Map<Hash, Hash[]>) {
    this._edges = map;
  }

  public cost(from_node: Hash, to_node: Hash): number {
    return 1;
  }

  public neighbors(location: Hash): Hash[] {
    const neighbors = this._edges.get(location);
    if (neighbors == null) {
      return []
    }
    return neighbors;
  }

  public bfs(start: Hash, goal: Hash) {
    const frontier = new Queue<Hash>();
    frontier.enqueue(start);
    const came_from = new Map<Hash, Hash|undefined>();
    came_from.set(start, undefined);

    while (!frontier.empty()) {
      const current = frontier.dequeue();
      if (current == goal) {
        break;
      }
      for (let next of this.neighbors(current)) {
        if (!came_from.has(next)) {
          frontier.enqueue(next);
          came_from.set(next, current);
        }
      }
    }
    return came_from;
  }

  public djikstra(start: Hash, goal: Hash) {
    const frontier = new PriorityQueueHash();
    frontier.enqueue(start, 0);
    const came_from = new Map<Hash, Hash|undefined>();
    const cost_so_far = new Map<Hash, number>();
    came_from.set(start, undefined);
    cost_so_far.set(start, 0);

    while (!frontier.empty()) {
      const current = frontier.dequeue();
      if (current[0] == goal) {
        break;
      }

      for (let next of this.neighbors(current[0])) {
        const new_cost = (cost_so_far.get(current[0]) as number)  + this.cost(current[0], next);
        if (new_cost < (cost_so_far.get(next) ?? Infinity)) {
          cost_so_far.set(next, new_cost);
          const priority = new_cost
          frontier.enqueue(next, priority);
          came_from.set(next, current[0]);
        }
      }
    }
    return this._reconstruct_path(came_from, start, goal);
  }

  private _reconstruct_path(came_from: Map<Hash, Hash|undefined>, start: Hash, goal: Hash): Hash[] {
    let current: Hash = goal;
    const path: Hash[] = [];
    if (!came_from.has(goal)) {
      return [];
    }
    while (current != start) {
      path.push(current);
      const new_current = came_from.get(current);
      if (new_current == null) {
        throw new GraphException("Unable to construct path");
      }
      current = new_current;
    }
    // path.push(start);
    return path.reverse();
  }

}

