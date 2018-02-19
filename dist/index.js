"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sfn_schedule_parser_1 = require("sfn-schedule-parser");
const HideProtectedProperties = require("hide-protected-properties");
let Schedule = class Schedule {
    constructor(pattern, task) {
        this._taskCalled = false;
        this.pattern = pattern;
        this.task = task;
        this._info = sfn_schedule_parser_1.parse(this.pattern);
        this.setTimer();
    }
    ontimeout(data) {
        let state = this._info.getState();
        if (state === 0) {
            if (this._taskCalled) {
                data = this.task(data);
            }
            else {
                this._taskCalled = true;
                data = this.task();
            }
            if (this._info.once) {
                this.stop();
            }
            else {
                this.setTimer(data);
            }
        }
        else if (state === -1) {
            this.stop();
        }
    }
    setTimer(data) {
        this._timer = setTimeout(() => {
            this.ontimeout(data);
        }, this._info.getBestTimeout());
    }
    stop() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }
};
Schedule = tslib_1.__decorate([
    HideProtectedProperties
], Schedule);
exports.Schedule = Schedule;
//# sourceMappingURL=index.js.map