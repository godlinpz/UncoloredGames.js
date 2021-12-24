import EventSourceMixin from "../EventSourceMixin.mjs";
import Job from "./job.mjs";

class Jobs
{
    constructor()
    {
        this.globalTime = 0; 
        this.jobs = [];
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
