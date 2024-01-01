#!/usr/bin/env python3

import sys
from collections import deque


pipe_map = {
    "|": [(1, 0), (-1, 0)],
    "-": [(0, 1), (0, -1)],
    "L": [(-1, 0), (0, 1)],
    "J": [(-1, 0), (0, -1)],
    "F": [(1, 0), (0, 1)],
    "7": [(1, 0), (0, -1)],
    ".": [],
}


def get_start_type(r, c):
    res = []
    for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
        for drr, dcc in pipe_map[grid[r + dr][c + dc]]:
            if dr + drr == 0 and dc + dcc == 0:
                res.append((dr, dc))
    assert len(res) == 2
    for ch, moves in pipe_map.items():
        if all(move in moves for move in res):
            return ch


def get_valid_moves(r, c):
    pipe_type = grid[r][c]
    return [(r + dr, c + dc) for dr, dc in pipe_map[pipe_type]]


with open(sys.argv[1], "r") as f:
    grid = [l.strip() for l in f.readlines()]

for startr, line in enumerate(grid):
    try:
        startc = line.index("S")
        break
    except:
        pass

grid[startr] = grid[startr].replace("S", get_start_type(startr, startc))

r, c = startr, startc
seen = set()
queue = deque([(r, c)])

while queue:
    r, c = queue.popleft()

    if (r, c) in seen:
        continue
    seen.add((r, c))

    for rr, cc in get_valid_moves(r, c):
        queue.append((rr, cc))


part1 = len(seen) // 2
print(f"Part 1: {part1}")


grid2 = ""
for r, line in enumerate(grid):
    for c, char in enumerate(line):
        grid2 += "." if (r, c) not in seen else char
    grid2 += "\n"
grid2 = grid2.split("\n")

part2 = 0
for line in grid2:
    outside = True
    startF = None
    for ch in line:
        match ch:
            case ".":
                if not outside:
                    part2 += 1
            case "|":
                outside = not outside
            case "F":
                startF = True
            case "L":
                startF = False
            case "-":
                assert not startF is None
            case "7":
                assert not startF is None
                if not startF:
                    outside = not outside
                startF = None
            case "J":
                assert not startF is None
                if startF:
                    outside = not outside
                startF = None

print(f"Part 2: {part2}")
