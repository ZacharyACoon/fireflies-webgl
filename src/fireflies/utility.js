

export function random(min, max, precision=1) {
    return Math.floor(Math.random() * precision * (max - min + 1/precision)) / precision + min;
}
