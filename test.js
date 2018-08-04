const assert = require("assert");
const { Schedule } = require("./");

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