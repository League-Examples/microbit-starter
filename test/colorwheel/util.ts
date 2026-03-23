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
     * Classify color by HSV hue from the color sensor.
     * Red wraps around 0°, so it needs two ranges.
     *
     * Hue ranges (measured from sensor):
     *   Red:    350-20   (hue ~6-14)
     *   Orange: 20-45    (hue ~35)
     *   Yellow: 45-75    (hue ~60-73)
     *   Green:  75-160   (hue ~100-135)
     *   Blue:   160-210  (hue ~190-219)
     *   Purple: 210-350  (hue ~229-254)
     */
    export function classifyByHue(): string {
        let h = colorsensor.hue()
        if (h < 0) return "?"
        if (h >= 350 || h < 20) return "Red"
        if (h >= 20 && h < 45) return "Orange"
        if (h >= 45 && h < 75) return "Yellow"
        if (h >= 75 && h < 160) return "Green"
        if (h >= 160 && h < 210) return "Blue"
        if (h >= 210 && h < 350) return "Purple"
        return "?"
    }
}
