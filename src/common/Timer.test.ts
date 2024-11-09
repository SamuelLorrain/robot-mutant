import { expect, test} from "vitest";
import Timer from "@/common/Timer";

test("Can create Timer instance", () => {
  const timer = new Timer();
  expect(timer).toBeInstanceOf(Timer);
});

test("Can start timer", () => {
  const timer = new Timer();
  timer.start();
  expect(timer.isStarted).toEqual(true);
})
