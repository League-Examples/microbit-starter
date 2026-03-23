/**
 * Utility functions — pure math, no hardware access.
 */
namespace app {

    /**
     * Circular mean of an array of angles in degrees.
     */
    export function circMeanArr(angles: number[]): number {
        let sinS = 0
        let cosS = 0
        for (let j = 0; j < angles.length; j++) {
            let rad = angles[j] * 3.14159 / 180
            sinS += Math.sin(rad)
            cosS += Math.cos(rad)
        }
        let deg = Math.round(Math.atan2(sinS / angles.length, cosS / angles.length) * 180 / 3.14159)
        if (deg < 0) deg += 360
        return deg
    }

    /**
     * Compute the midpoint of an arc between two boundary angles,
     * taking sweep direction into account.
     * @param enteredAt angle where the zone started
     * @param pos angle where the zone ended
     * @param cw true if sweeping clockwise (increasing angles)
     */
    export function arcMidpoint(enteredAt: number, pos: number, cw: boolean): number {
        if (cw) {
            if (pos >= enteredAt) {
                return Math.round((enteredAt + pos) / 2)
            } else {
                return Math.round(((enteredAt + pos + 360) / 2) % 360)
            }
        } else {
            if (enteredAt >= pos) {
                return Math.round((enteredAt + pos) / 2)
            } else {
                return Math.round(((enteredAt + pos) / 2 + 180) % 360)
            }
        }
    }

    /**
     * K-means nearest-centroid classifier for the 4 color zones.
     * Takes normalized chromaticity (r, g, b in milliunits 0-1000)
     * and normalized intensity i.
     * Returns label "A" (blue), "B" (red), "C" (green), or "D" (orange).
     */
    export function classifyChroma(r: number, g: number, b: number, i: number): string {
        let d0 = (r - 97) * (r - 97) + (g - 303) * (g - 303) + (b - 600) * (b - 600) + (i - 930) * (i - 930)
        let d1 = (r - 395) * (r - 395) + (g - 346) * (g - 346) + (b - 259) * (b - 259) + (i - 105) * (i - 105)
        let d2 = (r - 143) * (r - 143) + (g - 574) * (g - 574) + (b - 283) * (b - 283) + (i - 756) * (i - 756)
        let d3 = (r - 377) * (r - 377) + (g - 449) * (g - 449) + (b - 175) * (b - 175) + (i - 666) * (i - 666)

        let minD = d0
        let label = "A"
        if (d1 < minD) { minD = d1; label = "B" }
        if (d2 < minD) { minD = d2; label = "C" }
        if (d3 < minD) { minD = d3; label = "D" }
        return label
    }
}
