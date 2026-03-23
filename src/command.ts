/**
 * Serial command dispatcher and application logic.
 *
 * Mapping: sweeps 3x CW + 3x CCW, recording transition angles
 * (where classifier label changes). Groups by boundary pair,
 * circular-averages to get 4 stable boundary positions, then
 * computes color centers as midpoints between boundaries.
 *
 * Buttons: A = next color CW, B = next color CCW.
 */
namespace app {

    // Sorted color centers (by angle) and their names
    export let colorAngles: number[] = []
    export let colorNames: string[] = []
    export let colorCount = 0
    export let currentColorIdx = -1
    export let mapped = false

    // --- Dispatch ---

    export function handleCommand(line: string) {
        if (!line || line.length == 0) return

        let spaceIdx = line.indexOf(" ")
        let cmd = ""
        let arg = ""
        if (spaceIdx < 0) {
            cmd = line
        } else {
            cmd = line.substr(0, spaceIdx)
            arg = line.substr(spaceIdx + 1)
        }

        if (cmd == "MAP") doMap()
        else if (cmd == "SEQ") doSeq()
        else if (cmd == "COLOR") doColor(arg)
        else if (cmd == "READ") doRead()
        else if (cmd == "CAL") doCal()
        else if (cmd == "GOTO") doGoto(arg)
        else if (cmd == "STOP") doStop()
        else if (cmd == "SPIN") doSpin()
        else if (cmd == "HELLO") announce.handleHello("HELLO")
        else serial.writeLine("ERR:" + cmd)
    }

    // --- Commands ---

    function doMap() {
        mapColors()
    }

    function doSeq() {
        if (!mapped) mapColors()
        runSequence()
    }

    function doColor(arg: string) {
        if (!arg || arg.length == 0) {
            serial.writeLine("ERR:COLOR requires a color name")
            return
        }
        if (!mapped) mapColors()
        goToColor(arg)
    }

    function doRead() {
        let h = colorsensor.hue()
        let s = colorsensor.saturation()
        let v = colorsensor.value()
        let color = classify()
        serial.writeLine("POS:" + motorAbsAngle() + " H:" + h + " S:" + s + " V:" + v + " " + color)
    }

    function doCal() {
        serial.writeLine("CAL:start")
        motorResetRel()
        motorSpin(15)
        while (true) {
            let rel = motorRelAngle()
            let pos = motorAbsAngle()
            let hue = readHue()
            serial.writeLine("C:" + pos + "," + hue)
            if (rel >= 370) break
            basic.pause(100)
        }
        motorStop()
        serial.writeLine("CAL:done")
    }

    function doGoto(arg: string) {
        if (!arg || arg.length == 0) {
            serial.writeLine("ERR:GOTO requires an angle")
            return
        }
        let angle = parseInt(arg)
        motorMoveTo(angle)
        basic.pause(500)
        serial.writeLine("AT:" + motorAbsAngle())
    }

    function doStop() {
        motorStop()
        serial.writeLine("STOPPED")
    }

    function doSpin() {
        motorSpin(15)
        serial.writeLine("SPINNING")
    }

    // --- Transition-based mapping ---

    // Boundary key: sorted pair of labels, e.g. "A-B"
    function boundaryKey(a: string, b: string): string {
        if (a < b) return a + "-" + b
        return b + "-" + a
    }

    // Collect transition angles from one sweep.
    // Appends to transAngles/transKeys arrays.
    function sweepTransitions(speed: number, tag: string,
        transAngles: number[], transKeys: string[]) {
        let lastColor = ""
        motorResetRel()
        motorSpin(speed)

        while (true) {
            let rel = motorRelAngle()
            let pos = motorAbsAngle()
            let color = classify()

            if (color != lastColor && lastColor != "") {
                let key = boundaryKey(lastColor, color)
                transAngles.push(pos)
                transKeys.push(key)
                serial.writeLine("MAP:" + tag + " " + lastColor + ">" + color + " @" + pos)
            }
            lastColor = color

            if (rel >= 1080 || rel <= -1080) break
            basic.pause(50)
        }
        motorStop()
        basic.pause(300)
    }

    export function mapColors() {
        serial.writeLine("MAP:start")
        basic.showIcon(IconNames.Target)

        let transAngles: number[] = []
        let transKeys: string[] = []

        // 3 rotations CW + 3 rotations CCW
        sweepTransitions(15, "CW", transAngles, transKeys)
        sweepTransitions(-15, "CCW", transAngles, transKeys)

        // Find unique boundary keys
        let uniqueKeys: string[] = []
        for (let i = 0; i < transKeys.length; i++) {
            let found = false
            for (let j = 0; j < uniqueKeys.length; j++) {
                if (uniqueKeys[j] == transKeys[i]) { found = true; break }
            }
            if (!found) uniqueKeys.push(transKeys[i])
        }

        // Average each boundary's angles (discard spurious boundaries with < 3 samples)
        let boundaryAngles: number[] = []
        let boundaryKeys: string[] = []
        for (let ki = 0; ki < uniqueKeys.length; ki++) {
            let key = uniqueKeys[ki]
            let angles: number[] = []
            for (let i = 0; i < transAngles.length; i++) {
                if (transKeys[i] == key) angles.push(transAngles[i])
            }
            if (angles.length < 3) {
                serial.writeLine("MAP:skip " + key + " (" + angles.length + " samples)")
                continue
            }
            let avg = circMeanArr(angles)
            boundaryAngles.push(avg)
            boundaryKeys.push(key)
            serial.writeLine("MAP:boundary " + key + "=" + avg + " (" + angles.length + " samples)")
        }

        // Sort boundaries by angle
        for (let i = 0; i < boundaryAngles.length - 1; i++) {
            for (let j = i + 1; j < boundaryAngles.length; j++) {
                if (boundaryAngles[j] < boundaryAngles[i]) {
                    let tmp = boundaryAngles[i]; boundaryAngles[i] = boundaryAngles[j]; boundaryAngles[j] = tmp
                    let tmps = boundaryKeys[i]; boundaryKeys[i] = boundaryKeys[j]; boundaryKeys[j] = tmps
                }
            }
        }

        // Compute color centers: midpoint between adjacent boundaries.
        // Each boundary key is "X-Y". The color between boundary[i] and
        // boundary[i+1] is the label shared by both keys... or rather,
        // we read the sensor at the midpoint to find out.
        colorAngles = []
        colorNames = []
        colorCount = 0
        let nBounds = boundaryAngles.length
        if (nBounds >= 4) {
            for (let i = 0; i < nBounds; i++) {
                let nextI = (i + 1) % nBounds
                let center = arcMidpoint(boundaryAngles[i], boundaryAngles[nextI], true)
                colorAngles.push(center)
                colorCount++
            }

            // Move to each center and classify to get the color name
            for (let i = 0; i < colorCount; i++) {
                motorMoveTo(colorAngles[i])
                basic.pause(500)
                let name = classify()
                colorNames.push(name)
                serial.writeLine("MAP:" + name + "=" + colorAngles[i] + " H:" + colorsensor.hue())
            }

            // Sort by angle
            for (let i = 0; i < colorCount - 1; i++) {
                for (let j = i + 1; j < colorCount; j++) {
                    if (colorAngles[j] < colorAngles[i]) {
                        let tmp = colorAngles[i]; colorAngles[i] = colorAngles[j]; colorAngles[j] = tmp
                        let tmps = colorNames[i]; colorNames[i] = colorNames[j]; colorNames[j] = tmps
                    }
                }
            }

            mapped = true
            currentColorIdx = 0
        } else {
            serial.writeLine("MAP:ERR only found " + nBounds + " boundaries")
        }

        serial.writeLine("MAP:done")
        basic.showIcon(IconNames.Yes)
    }

    // --- Navigation ---

    /** Move to next color in CW direction. */
    export function nextColorCW() {
        if (!mapped || colorCount == 0) return
        currentColorIdx = (currentColorIdx + 1) % colorCount
        let name = colorNames[currentColorIdx]
        let angle = colorAngles[currentColorIdx]
        motorMoveTo(angle)
        basic.pause(500)
        serial.writeLine(name + " P:" + angle + " sensed:" + classify())
    }

    /** Move to next color in CCW direction. */
    export function nextColorCCW() {
        if (!mapped || colorCount == 0) return
        currentColorIdx = (currentColorIdx - 1 + colorCount) % colorCount
        let name = colorNames[currentColorIdx]
        let angle = colorAngles[currentColorIdx]
        motorMoveTo(angle)
        basic.pause(500)
        serial.writeLine(name + " P:" + angle + " sensed:" + classify())
    }

    export function goToColor(name: string) {
        let target = -1
        for (let i = 0; i < colorCount; i++) {
            if (colorNames[i] == name) {
                target = colorAngles[i]
                currentColorIdx = i
                break
            }
        }
        if (target < 0) {
            serial.writeLine("ERR:" + name + " not mapped")
            return
        }
        motorMoveTo(target)
        basic.pause(500)
        serial.writeLine(name + " P:" + target + " sensed:" + classify())
    }

    export function runSequence() {
        serial.writeLine("SEQ:start")
        goToColor("Blue")
        basic.pause(300)
        goToColor("Red")
        basic.pause(300)
        goToColor("Blue")
        basic.pause(300)
        goToColor("Orange")
        basic.pause(300)
        goToColor("Green")
        serial.writeLine("SEQ:done")
    }

    /** Register the serial command listener. */
    export function commandInit() {
        serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
            let line = serial.readUntil(serial.delimiters(Delimiters.NewLine))
            handleCommand(line)
        })
    }
}
