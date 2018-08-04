# SFN-Scheduler

**Simple Friendly Node.js Scheduler for tasks.**

## Install

```sh
npm i sfn-scheduler
```

## Example

```javascript
const { Schedule } = require("sfn-scheduler");

// the schedule will run automatically after you've instantiated the class

var schedule1 = new Schedule("every 2 seconds", () => {
    console.log("This schedule runs every 2 seconds.");
});

var schedule2 = new Schedule("in 2 days", () => {
    console.log("This schedule has been waiting for 2 days.");
});

var schedule3 = new Schedule("20:00", () => {
    console.log("This schedule runs at 20:00 this evening.");
});

var schedule4 = new Schedule("*:30", () => {
    console.log("This schedule runs at 30 minutes of every hour in today.");
});

var schedule5 = new Schedule("*-*-1 8:00", () => {
    console.log("This schedule runs on every first day in every month.");
});
```

## Schedule pattern

Here I will list several patterns (statements), just to demonstrate the 
capability of this package, they're all in human language.

- `runs the schedule every 2 hours`
- `I wish to run the program in 2 hours`
- `execute the application on Monday`
- `runs at 20:00 today`
- `runs in 2 days`
- `runs every day at 12:00`
- `only runs on Monday in this month`
- `2018-8-* 12:00`
- `runs in Aug. 2018, every day at 12:00`

This module is backed by 
[sfn-schedule-parser](https://github.com/hyurl/sfn-schedule-parser), which 
exposes a common API for Node.js to build schedulers. For full supported 
patterns, you should follow it for newest features.

## Return values from the task

If you return a value from the task function, unlike most of other timer 
modules, the returning value in a task function of this module will not be 
ignored, and it will be used as an argument passed to the task function again 
at the next tick. See this example:

```javascript
var schedule = new Schedule("runs every 2 minutes", (num = 1) => {
    console.log("Running count: %d.", num);
    return num + 1;
});

// The output would like this:
// Running count: 1.
// Running count: 2.
// Running count: 3.
// ...
```

## How to stop?

You can call the method `stop()` to terminate the schedule whenever you want.

```javascript
var schedule = new Schedule("runs every 2 minutes", () => {
    // ...
    schedule.stop();
});
```

Once you have stopped the schedule, you can call method `resume()` to restart 
it.