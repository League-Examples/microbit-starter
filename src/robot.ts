/**
 * Student robot functions. Add your challenge solutions here.
 */
//% color="#FF8000" weight=100 icon="\uf1b9"
namespace robot {

    /**
     * Example: drive forward for a duration.
     * Replace with real motor commands once you add
     * your robot platform's extension.
     */
    //% block="drive forward for $ms ms"
    export function driveForward(ms: number): void {
        // TODO: Replace with actual motor commands
        basic.showArrow(ArrowNames.North)
        basic.pause(ms)
        basic.clearScreen()
    }
}
