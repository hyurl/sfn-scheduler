"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sfn_schedule_parser_1 = require("sfn-schedule-parser");
var HideProtectedProperties = require("hide-protected-properties");
var Schedule = (function (_super) {
    __extends(Schedule, _super);
    function Schedule(pattern, task) {
        var _this = _super.call(this, pattern) || this;
        _this._taskCalled = false;
        _this.task = task;
        _this.resume();
        return _this;
    }
    Schedule.prototype.onTimeout = function (data) {
        var state = this.getState();
        if (state === 0) {
            if (this._taskCalled) {
                data = this.task(data);
            }
            else {
                this._taskCalled = true;
                data = this.task();
            }
            if (this.once) {
                this.stop();
            }
            else if (this._timer !== null) {
                this.resume(data);
            }
        }
        else if (state === -1) {
            this.stop();
        }
    };
    Schedule.prototype.resume = function (data) {
        var _this = this;
        this._timer = setTimeout(function () {
            _this.onTimeout(data);
        }, this.getBestTimeout());
    };
    Schedule.prototype.stop = function () {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    };
    return Schedule;
}(sfn_schedule_parser_1.ScheduleInfo));
exports.Schedule = Schedule;
exports.default = Schedule;
HideProtectedProperties(Schedule);
//# sourceMappingURL=index.js.map