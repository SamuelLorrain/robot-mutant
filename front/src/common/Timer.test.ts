import { AutonomousTimer } from "@/common/Timer";

test("Can create AutonomousTimer instance", () => {
  const timer = new AutonomousTimer();
  expect(timer).toBeInstanceOf(AutonomousTimer);
});

test("Can start timer", () => {
  const timer = new AutonomousTimer();
  timer.start();
  expect(timer.isStarted).toEqual(true);
})
