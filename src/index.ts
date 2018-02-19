import { parse, ScheduleInfo } from "sfn-schedule-parser";
import HideProtectedProperties = require("hide-protected-properties");

@HideProtectedProperties
export class Schedule {
    readonly pattern: string;
    readonly task: (data?: any) => any;
    /** @private */
    private _info: ScheduleInfo;
    /** @private */
    private _timer: NodeJS.Timer;
    /** @private */
    private _taskCalled: boolean = false;

    /** Creates a new schedule. */
    constructor(pattern: string, task: (data?: any) => any) {
        this.pattern = pattern;
        this.task = task;
        this._info = parse(this.pattern);

        this.setTimer();
    }

    /** @private */
    private ontimeout(data?: any) {
        let state = this._info.getState();

        if (state === 0) {
            // run the task
            if (this._taskCalled) {
                data = this.task(data);
            } else {
                this._taskCalled = true;
                data = this.task();
            }

            if (this._info.once) {
                this.stop();
            } else {
                this.setTimer(data);
            }
        } else if (state === -1) {
            this.stop();
        }
    }

    /** @private */
    private setTimer(data?: any) {
        this._timer = setTimeout(() => {
            this.ontimeout(data);
        }, this._info.getBestTimeout());
    }

    /** Stops the schedule. */
    stop() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }
}