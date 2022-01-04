import EventSourceMixin from "../EventSourceMixin.mjs";
import Job from "./job.mjs";

class Jobs
{
    constructor()
    {
        Object.assign(this, {
            globalTime: 0,
            jobs: [],
            autoUpdateEnabled: false,
            autoUpdateFrequency: 200,
            autoUpdateTimer: null,
            paused: false,
            currentTime: 0,
        })
    }

    enableAutoupdate(frequency)
    {
        if(frequency)
            this.autoUpdateFrequency = frequency;

        this.autoUpdateEnabled = true;
        this.autoUpdateTimer = setInterval(() => this.updateTime((new Date()).getDate()))
    }

    disableAutoupdate()
    {
        this.autoUpdateEnabled = false;
        clearInterval(this.autoUpdateTimer);
        this.autoUpdateTimer = null;
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

    updateTime(time)
    {
        this.globalTime = time; 
        this.trigger('timeUpdated', time);
        this.run();
    }

    addTime(deltaTime)
    {
        this.updateTime(this.globalTime + deltaTime);
    }

    run()
    {

    }

    job(callback, timeout, times = 1)
    {
        const job = new Job(callback, timeout, times);
        this.jobs.push(job);
        this.trigger('jobAdded', job);
        return job;
    }

}

Object.assign(Jobs.prototype, EventSourceMixin);

export default Jobs;
