import EventSource from '../util/EventSource.mjs';
import Job from "./job.mjs";
import { binarySearchInsert } from "../util/binarySearch.mjs";
import getCurrentTimeDefault from "../util/getCurrentTimeDefault.mjs";

class Jobs
{
    constructor(getCurrentTime = getCurrentTimeDefault)
    {
        Object.assign(this, {
            lastTickTime: 0, // last saved time stamp
            jobTime: 0, // internal time, can be slowed, accelerated and paused
            getCurrentTime, // default method to get system time
            paused: false, // while in pause all jobs are paused
            acceleration: 1, // acceleration of internal time (1 = the same to system, 0.5 = half speed from system, etc.)
            jobs: [],
            autoUpdateEnabled: false, // is the queue in self update mode
            autoUpdateFrequency: 33, // frequency if using setTimeout
            autoUpdateTimer: null,
            timeUpdaterFunc: this.timeUpdaterFuncDefault, // function for self updating timer
            runAutoupdateBound: this.runAutoupdate.bind(this), 
            jobHandlers: [
                ['finished', this.onJobFinished.bind(this)],
                ['pause', this.onJobPause.bind(this)],
                ['unpause', this.onJobUnPause.bind(this)],
                ['updated', this.onJobUpdated.bind(this)],
            ]
        });

        EventSource.createEventSource(this);
    }
    
    timeUpdaterFuncDefault(callback) {
        this.autoUpdateTimer = setTimeout(() => callback(this.getCurrentTime()), this.autoUpdateFrequency);
    }

    runAutoupdate(time) {
        if(this.autoUpdateEnabled) 
        {
            this.updateTime(time); 
            this.timeUpdaterFunc(this.runAutoupdateBound);
        }

    }

    // Time autoupdate can be performed using either setInterval or requestAnimationFrame
    enableAutoupdate(frequency = 33, timeUpdaterFunc = null)
    {
        if(this.autoUpdateEnabled) 
            this.disableAutoupdate();

        if(frequency)
            this.autoUpdateFrequency = frequency;

        if(timeUpdaterFunc)
            this.timeUpdaterFunc = timeUpdaterFunc;

        this.autoUpdateEnabled = true;

        this.runAutoupdate(this.lastTickTime);
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
        this._events.trigger('paused');
    }

    unpause()
    {
        this.paused = false;
        this._events.trigger('unpaused');
    }

    updateTime(time)
    {
        if(!this.paused)
        {
            const delta = time - this.lastTickTime;
            this.jobTime += delta * this.acceleration;
    
            this._events.trigger('tick', this.jobTime, time);
            this.run();
        }
        this.lastTickTime = time; 
    }

    run()
    {
        const jobs = this.jobs;
        const jobsToRun = [];
        // Collecting timed out jobs. 
        // Since jobs list is always sorted we can stop collecting on the first inappropriate job
        for(let i = 0, done = false; i < jobs.length && !done; ++i)
        {
            const job = jobs[i];
            done = job.getNextTimeToRun() > this.jobTime;
            if(!done) jobsToRun.push(job);
        }

        // running timed out jobs
        for(let i = 0; i < jobsToRun.length; ++i)
            jobsToRun.updateTime(this.jobTime);
    }

    addJobTime(deltaTime)
    {
        this.jobTime += deltaTime;
    }

    setAcceleration(acceleration) 
    {
        this.acceleration = acceleration;
    }

    job(callback, timeout, times = 1)
    {
        const job = new Job(this.jobTime, callback, timeout, times, 
            () => this.jobTime);
        this.addJob(job);
    }

    addJob(job) 
    {
        this.jobHandlers.forEach((...handler) => job._events.on(...handler));
        this.queueJob(job);
        this._events.trigger('jobAdded', job);
        return job;
    }

    queueJob(job)
    {
        job.updateTime(this.jobTime);
        binarySearchInsert(this.jobs, job, j => j.getNextTimeToRun());
        return job;
    }

    unQueueJob(job) 
    {
        this.jobs.splice(this.jobs.indexOf(job), 1);
    }

    onJobFinished(data, _, job)
    {
        this.unQueueJob(job);
        this.jobHandlers.forEach((...handler) => job._events.un(...handler));
    }

    onJobPause(data, _, job)
    {
        this.unQueueJob(job);
    }

    onJobUnPause(data, _, job)
    {
        this.queueJob(job);    
    }

    onJobUpdated(data, _, job)
    {
        this.unQueueJob(job);
        this.queueJob(job);    
    }

}

export default Jobs;
