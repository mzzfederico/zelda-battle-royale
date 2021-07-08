export function roundFloat(num: number, places: number = 1000): number {
    return (parseInt(num * places) / places);
}