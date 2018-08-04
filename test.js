var assert = require("assert");
var Schedule = require("./").default;

var count = 0;

var schedule = new Schedule("every 2 seconds", () => {
    count++;

    if (count % 3 === 0) {
        schedule.stop();
    }
});

setTimeout(() => {
    assert.strictEqual(count, 3);
    console.log("#### OK ####");
}, 6000);