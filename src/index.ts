import { ScheduleInfo } from "sfn-schedule-parser";
import HideProtectedProperties = require("hide-protected-properties");

export class Schedule extends ScheduleInfo {
    readonly task: (data?: any) => any;
    /** @private */
    private _timer: NodeJS.Timer;
    /** @private */
    private _taskCalled: boolean = false;

    /** Creates a new schedule. */
    constructor(pattern: string, task: (data?: any) => any) {
        super(pattern);
        this.task = task;
        this.resume();
    }

    /** @private */
    private onTimeout(data?: any) {
        let state = this.getState();

        if (state === 0) {
            // run the task
            if (this._taskCalled) {
                data = this.task(data);
            } else {
                this._taskCalled = true;
                data = this.task();
            }

            if (this.once) {
                this.stop();
            } else if (this._timer !== null) {
                this.resume(data);
            }
        } else if (state === -1) {
            this.stop();
        }
    }

    /**
     * Continue running the schedule.
     * @param data The data passed to the task function.
     */
    resume(data?: any) {
        this._timer = setTimeout(() => {
            this.onTimeout(data);
        }, this.getBestTimeout());
    }

    /** Stops the schedule. */
    stop() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }
}

export default Schedule;

HideProtectedProperties(Schedule);