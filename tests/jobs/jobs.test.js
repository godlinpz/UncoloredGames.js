
import Jobs from '../../jobs/jobs.mjs';
import jest from 'jest-mock';

describe('Jobs calls', () => {

    function init()
    {
        const callback = jest.fn();
        return {
            callback, 
            jobs: new Jobs()
        };
    }

    test('initializes with autoupdate disabled', () => {
        const {jobs} = init();

        expect(jobs.paused).toBeFalsy();
        expect(jobs.autoUpdateEnabled).toBeFalsy();
        expect(jobs.autoUpdateTimer).toBeFalsy();
        expect(jobs.currentTime).toBe(0);
        expect(jobs.autoUpdateFrequency).toBe(33);
        expect(jobs.acceleration).toBe(1);

    });

    test('can be paused', () => {
        const {jobs} = init();
        jobs.pause();
        expect(jobs.paused).toBeTruthy();
    });

    test('can be unpaused', () => {
        const {jobs} = init();
        jobs.pause();
        jobs.unpause();
        expect(jobs.paused).toBeFalsy();
    });

    test('can enable autoupdate', () => {
        const {jobs} = init();
        jobs.enableAutoupdate(100, false, {});

        expect(jobs.autoUpdateEnabled).toBeTruthy();
        expect(jobs.autoUpdateTimer).toBeTruthy();
        expect(jobs.autoUpdateFrequency).toBe(100);
    });

    test('can disable autoupdate', () => {
        const {jobs} = init();
        jobs.enableAutoupdate(100, false, {});
        jobs.disableAutoupdate();

        expect(jobs.autoUpdateEnabled).toBeFalsy();
        expect(jobs.autoUpdateTimer).toBeFalsy();
    });

})