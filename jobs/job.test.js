import Job from '../../jobs/job.mjs';

describe('Test Job calss', () => {

    test('can be paused', () => {
        const job = new Job(0, null, 1, 1);
        job.pause();
        expect(job.paused).toBeTruthy();
    });
})