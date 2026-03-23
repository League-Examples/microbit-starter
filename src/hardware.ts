/**
 * Hardware abstraction — all sensor reads and motor control
 * go through these functions.
 */
namespace app {

    // Last color reading, normalized to chromaticity (milliunits)
    export let chromaR = 0
    export let chromaG = 0
    export let chromaB = 0
    export let chromaI = 0

    /** Initialize color sensor hardware. */
    export function hwInit() {
        colorsensor.init()
    }

    // --- Color sensor ---

    /** Read color sensor and update chroma values. */
    export function readChroma() {
        let R = colorsensor.red()
        let G = colorsensor.green()
        let B = colorsensor.blue()
        let I = colorsensor.clear()
        let sum = R + G + B
        if (sum == 0) {
            chromaR = 0
            chromaG = 0
            chromaB = 0
            chromaI = 0
        } else {
            chromaR = Math.round(R * 1000 / sum)
            chromaG = Math.round(G * 1000 / sum)
            chromaB = Math.round(B * 1000 / sum)
            chromaI = Math.round((I - 3635) * 1000 / 5244)
        }
    }

    /** Read color sensor, classify by hue, return color name. */
    export function classify(): string {
        return classifyByHue()
    }

    /** Read PlanetX hue value (used in CAL). */
    export function readHue(): number {
        return Math.round(planetx.readColor())
    }

    // --- Motor ---

    export function motorSpin(speed: number) {
        nezhaV2.start(nezhaV2.MotorPostion.M1, speed)
    }

    export function motorStop() {
        nezhaV2.stop(nezhaV2.MotorPostion.M1)
    }

    export function motorMoveTo(angle: number) {
        nezhaV2.moveToAbsAngle(nezhaV2.MotorPostion.M1, nezhaV2.ServoMotionMode.ShortPath, angle)
    }

    export function motorAbsAngle(): number {
        return Math.round(nezhaV2.readAbsAngle(nezhaV2.MotorPostion.M1))
    }

    export function motorResetRel() {
        nezhaV2.resetRelAngleValue(nezhaV2.MotorPostion.M1)
    }

    export function motorRelAngle(): number {
        return nezhaV2.readRelAngle(nezhaV2.MotorPostion.M1)
    }
}
