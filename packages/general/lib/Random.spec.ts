import Random from '@photon-rush/general/lib/Random';
import { equal } from 'assert';

const seed = new BigUint64Array(4);
seed[0]    = 128n;
seed[1]    = 256n;
seed[2]    = 512n;
seed[3]    = 1024n;


describe('@photon-rush/general/lib/Random', () => {
    it('should generate an array of bigint', () => {
        const random = new Random(seed);

        const data = random.fill(32);

        // const output = data
        //     .map(n => n.toString(16).toUpperCase())
        //     .join('\n')
        //     ;

        // console.log(output);

        equal(Array.isArray(data), true);
    });

    it('should generate a positive number within bounds', () => {
        const random = new Random();

        const min = 10;
        const max = 20;

        const value = random.within(min, max);

        const inBounds = value >= min && value <= max;

        equal(inBounds, true, `${value} >= ${min} && ${value} <= ${max}`);
    });

    it('should generate a negative number within bounds', () => {
        const random = new Random();

        const min = -20;
        const max = 0;

        const value = random.within(min, max);

        const inBounds = value >= min && value <= max;

        equal(inBounds, true, `${value} >= ${min} && ${value} <= ${max}`);

    });

    it('should generate a zero number within bounds', () => {
        const random = new Random(seed);

        const value = random.within(-0, 0);

        const valid = value === 0n;

        equal(valid, true);
    });

    it('dice rolls', () => {
        const random = new Random();

        const result: Array<number> = [0, 0, 0, 0, 0, 0];
        let badRolls                = 0;

        for (let j = 0; j < 1000000; j++)  {
            const value = random.roll(6);

            if (value > 6 || value <= 0) {
                badRolls++;
            } else {
                result[value - 1]++;
            }
        }

        const message = result
            .map((r, i) => `${i + 1}: ${r}`)
            .join('\n')
        ;

        console.log(message);
        console.log(`bad=${badRolls}`);

        console.log(random.percentage());

    });

});