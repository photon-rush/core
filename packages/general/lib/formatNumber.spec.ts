import { formatNumber } from '@photon-rush/general/lib/formatNumber';
import { equal } from 'assert';

describe('@photon-rush/general/lib/formatNumber', () => {
    it('should correctly format Infinity', () => equal(formatNumber(Infinity), '+∞∞∞.∞∞∞ '));
    it('should correctly format -Infinity', () => equal(formatNumber(-Infinity), '-∞∞∞.∞∞∞ '));
    it('should correctly format NaN', () => equal(formatNumber(NaN), '   NaN   '));

    it('should correctly format 0', () => equal(formatNumber(0), ' 000.000 '));
    it('should correctly format -0', () => equal(formatNumber(-0), ' 000.000 '));

    it('should correctly format 3.1457', () => equal(formatNumber(3.1457), '+003.145 '));
    it('should correctly format 0.1456', () => equal(formatNumber(0.1456), '+000.145 '));
    it('should correctly format 0.10', () => equal(formatNumber(0.10), '+000.100 '));
    it('should correctly format 10', () => equal(formatNumber(10), '+010.000 '));
    it('should correctly format 10.10', () => equal(formatNumber(10.10), '+010.100 '));

    it('should correctly format -5893', () => equal(formatNumber(-5893), '-005.893k'));
    it('should correctly format 5893', () => equal(formatNumber(5893), '+005.893k'));

    it('should correctly format 453241123.432', () => equal(formatNumber(453241123.432), '+453.241m'));
    it('should correctly format 4532411.432', () => equal(formatNumber(4532411.432), '+004.532m'));
});