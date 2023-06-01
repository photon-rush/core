export type EffectFn = (value: number) => number;

export default class Item {


    speed?       : EffectFn;
    sense?       : EffectFn;
    capability?  : EffectFn;
    perception?  : EffectFn;
    intelligence?: EffectFn;
    gumption?    : EffectFn;
}