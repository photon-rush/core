

interface IMentalAttributes {
    creativity: number,
    empathy   : number,
    power     : number,
    faith     : number,
    truth     : number,
    joy       : number,
}

interface IPhysicalAttributes {
    strength  : number,
    resilience: number,
    agility   : number,
    dexterity : number,
}

interface ISensor {
    name                 : string,
    absoluteThreshold    : number,
    differentialThreshold: number,
}

interface ISensorium {
    visual     : ISensor,
    auditory   : ISensor,
    tactile    : ISensor,
    gustatory  : ISensor,
    olfactory  : ISensor,
    equilibrium: ISensor,

}

export default interface IDrone extends IMentalAttributes, IPhysicalAttributes, ISensorium {
    name: string,
    id  : string,

    health: number,
    energy: number,


}