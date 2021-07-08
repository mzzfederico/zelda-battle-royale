export default function rollDice(min: number, max: number): number {
    return (min - 1) + Math.ceil(Math.random() * (max - min + 1))
}