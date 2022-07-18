import EventSourceMixin from "../EventSourceMixin.mjs";
import getCurrentTimeDefault from "../util/getCurrentTimeDefault.mjs";

class Job
{
    constructor(firstRunTime, callback, timeout, times = 1, getCurrentTime = getCurrentTimeDefault)
    {
        Object.assign(this,
            {
                firstRunTime,
                countdownStartTime: firstRunTime,
                lastTickTime: 0,
                callback,
                timeout,
                times,
                timesLeft: times,
                paused: false,
                finished: false,
                pausedAt: null,
                getCurrentTime,
            }
        );
    }

    pause()
    {
        this.paused = true;
        this.pausedAt = this.lastTickTime;
        this.trigger('paused');
    }

    unpause()
    {
        this.paused = false;
        this.pausedAt = null;
        this.trigger('unpaused');
    }

    finish()
    {
        this.finished = true;
        this.trigger('finished');
    }

    getTimeLeft()
    {
        return this.countdownStartTime 
            + this.timeout 
            - this.lastTickTime;
    }

    getNextTimeToRun()
    {
        return this.countdownStartTime + this.timeout;
    }

    updateTime(currentTime = this.getCurrentTime())
    {
        const deltaTime = currentTime - this.lastTickTime;

        if (this.paused)
            this.countdownStartTime += this.deltaTime;
        else if(!this.paused && !this.finished 
           && (this.countdownStartTime + this.timeout) <= currentTime)
        {
            if(this.timesLeft)
            {
                --this.timesLeft;
                this.callback();
                this.trigger('updated');
            }

            if(!this.timesLeft)
            {
                this.finish();
            }
        }
        this.lastTickTime = currentTime;

        return this.timesLeft;
    }
}

Object.assign(Job.prototype, EventSourceMixin);

export default Job;
