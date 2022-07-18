import EventSourceMixin from "../EventSourceMixin.mjs";
import Job from "./job.mjs";

class Jobs
{
    constructor()
    {
        Object.assign(this, {
            systemTime: 0, // real time
            currentTime: 0, // internal time
            acceleration: 1, // acceleration of internal time (1 = the same to system, 0.5 = half speed from system)
            jobs: [],
            autoUpdateEnabled: false,
            autoUpdateFrequency: 33,
            autoUpdateTimer: null,
            paused: false,
        })
    }

    // Time autoupdate can be performed using either setInterval or requestAnimationFrame
    enableAutoupdate(frequency = 33, useRequestAnimationFrame = false, window = window)
    {
        if(frequency)
            this.autoUpdateFrequency = frequency;

        if(this.autoUpdateEnabled) 
            this.disableAutoupdate();

        this.autoUpdateEnabled = true;
        if(useRequestAnimationFrame && window && window.requestAnimationFrame) {
            const autoUpdateFunc = time => {
                if(this.autoUpdateFuncEnabled)
                {
                    this.updateTime(time);
                    window.requestAnimationFrame(autoUpdateFunc);
                }
            };
            window.requestAnimationFrame(autoUpdateFunc);
        }
        else
            this.autoUpdateTimer = setInterval(() => this.updateTime((new Date()).getDate()), this.autoUpdateFrequency);
    }


    disableAutoupdate()
    {
        this.autoUpdateEnabled = false;
        if(this.autoUpdateTimer) 
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
        if(!this.paused)
        {
            const delta = time - this.systemTime;
            this.currentTime += delta * this.acceleration;
    
            this.trigger('tick', this.currentTime, time);
            this.run();
        }
        this.systemTime = time; 
    }

    addTime(deltaTime)
    {
        this.currentTime += deltaTime;
    }

    setAcceleration(acceleration) 
    {
        this.acceleration = acceleration;
    }

    run()
    {

    }

    job(callback, timeout, times = 1)
    {
        const job = new Job(this.currentTime, callback, timeout, times);
        this.addJob(job);
    }

    addJob(job) 
    {
        this.jobs.push(job);
        this.trigger('jobAdded', job);
        return job;
    }

}

Object.assign(Jobs.prototype, EventSourceMixin);

export default Jobs;
