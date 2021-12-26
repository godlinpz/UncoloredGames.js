import Job from '../../jobs/job.mjs';
import jest from 'jest-mock';

describe('Test Job calls', () => {

    function init()
    {
        const callback = jest.fn();
        return {
            callback, 
            job: new Job(1, callback, 2, 1)
        };
    }

    test('can be paused', () => {
        const {callback, job} = init();
        job.pause();
        expect(job.paused).toBeTruthy();
    });

    test('can be unpaused', () => {
        const {callback, job} = init();
        job.pause();
        job.unpause();
        expect(job.paused).toBeFalsy();
    });

    test('can be finished', () => {
        const {callback, job} = init();
        job.finish();
        expect(job.finished).toBeTruthy();
    });

    test('returns the time left before next run', () => {
        const {callback, job} = init();
        expect(job.getTimeLeft(2)).toBe(1);
    });

    test('returns the next time to run', () => {
        const {callback, job} = init();
        expect(job.getNextTimeToRun()).toBe(3);
    });

    test('runs callback when time is out and finishes if no more runs', () => {
        const {callback, job} = init();
        const timesLeft = job.run(3);
        expect(callback).toHaveBeenCalled();
        expect(job.finished).toBeTruthy();
        expect(job.timesLeft).toBe(0);
        expect(timesLeft).toBe(0);
    });

    test('doesn`t run until time is out', () => {
        const {callback, job} = init();
        const timesLeft = job.run(2);
        expect(callback).not.toHaveBeenCalled();
        expect(job.finished).toBeFalsy();
        expect(job.timesLeft).toBe(1);
        expect(timesLeft).toBe(1);
    });
})