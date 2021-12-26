import EventSourceMixin from "../EventSourceMixin.mjs";

class Job
{
    constructor(startTime, callback, timeout, times = 1)
    {
        Object.assign(this,
            {
                startTime,
                lastTime: startTime,
                callback,
                timeout,
                times,
                timesLeft: times,
                paused: false,
                finished: false,
            }
        );
    }

    pause()
    {
        this.paused = true;
        this.trigger('paused');
    }

    unpause()
    {
        this.paused = false;
        this.trigger('unpaused');
    }

    finish()
    {
        this.finished = true;
        this.trigger('finished');
    }

    getTimeLeft(currentTime)
    {
        return this.lastTime + this.timeout - currentTime;
    }

    getNextTimeToRun()
    {
        return this.lastTime + this.timeout;
    }

    run(currentTime)
    {
        if(!this.paused && !this.finished 
           && (this.lastTime + this.timeout) <= currentTime)
        {
            if(this.timesLeft)
            {
                --this.timesLeft;
                this.lastTime
                this.callback();
            }

            if(!this.timesLeft)
            {
                this.finish();
            }
        }

        return this.timesLeft;
    }
}

Object.assign(Job.prototype, EventSourceMixin);

export default Job;
