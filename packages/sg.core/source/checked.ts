import IPhotonError from '@photon-rush/sg.core/source/photon/IPhotonError';
import { useEngine } from '@photon-rush/sg.core/source/photon';

/**
 * Catches an error thrown by a function, then continues on
 * @param fn The function that this decorator has been applied to
 * @param context The context for this function invocation
 * @returns The value fn would return or null if it throws an error.
 */
export default function checked<This, Args extends any[], Return>(fn: (this: This, ...args: Args) => Return | null, context: any) {
    const engine = useEngine();

    return function(this: This, ...args: Args) {
        if (context.kind === 'method') {
            let result: Return | null = null;

            try {
                result = fn.apply(this, args);
            } catch (error) {
                const sgError = new IPhotonError((error as Error).message, context.name, false, error as Error);

                engine.addError(sgError);

            }

            return result;
        }

    };
}


/**
 * Catches an error thrown by a function, then continues on
 * @param fn The function that this decorator has been applied to
 * @param context The context for this function invocation
 * @returns The value fn would return or null if it throws an error.
 */
export function checkedFatal<This, Args extends any[], Return>(fn: (this: This, ...args: Args) => Return | null, context: any) {
    const engine = useEngine();

    return function(this: This, ...args: Args) {
        if (context.kind === 'method') {
            let result: Return | null = null;

            try {
                result = fn.apply(this, args);
            } catch (error) {
                const sgError = new IPhotonError((error as Error).message, context.name, true, error as Error);

                engine.addError(sgError);

            }

            return result;
        }

    };
}