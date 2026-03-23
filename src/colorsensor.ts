/**
 * Color sensor reader — reads raw RGBC from the PlanetX color sensor
 * without the serial spam from PlanetX_Basic.readColor().
 *
 * Supports both the old APDS9960 (addr 0x39) and the newer sensor (addr 0x43).
 */
//% color="#e05030" weight=40 icon="\uf1fb"
namespace colorsensor {

    let _initialized = false
    let _addr = 0x39

    function i2cW(addr: number, reg: number, val: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = val
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cR(addr: number, reg: number): number {
        pins.i2cWriteBuffer(addr, pins.createBufferFromArray([reg]))
        return pins.i2cReadBuffer(addr, 1)[0]
    }

    function i2cR16(addr: number, reg: number): number {
        return i2cR(addr, reg) + i2cR(addr, reg + 1) * 256
    }

    /**
     * Initialize the color sensor. Call once at startup.
     * Tries the new sensor (0x43) up to 20 times, falls back to old (0x39).
     */
    //% block="initialize color sensor"
    export function init(): void {
        // Try new sensor at 0x43 (matches PlanetX init sequence)
        let buf = pins.createBuffer(2)
        for (let attempt = 0; attempt < 20; attempt++) {
            buf[0] = 0x81
            buf[1] = 0xCA
            pins.i2cWriteBuffer(0x43, buf)
            buf[0] = 0x80
            buf[1] = 0x17
            pins.i2cWriteBuffer(0x43, buf)
            basic.pause(50)
            let test = i2cR16(0x43, 0xA4)
            if (test != 0) {
                _addr = 0x43
                _initialized = true
                return
            }
        }

        // Fall back to old APDS9960 at 0x39
        i2cW(0x39, 0x81, 252)
        i2cW(0x39, 0x8F, 0x03)
        i2cW(0x39, 0x80, 0x00)
        i2cW(0x39, 0xAB, 0x00)
        i2cW(0x39, 0xE7, 0x00)
        i2cW(0x39, 0x80, 0x01)
        basic.pause(10)
        let en = i2cR(0x39, 0x80) | 0x02
        i2cW(0x39, 0x80, en)
        basic.pause(50)
        _addr = 0x39
        _initialized = true
    }

    /**
     * Read raw red channel value.
     */
    //% block="color red"
    export function red(): number {
        if (!_initialized) init()
        if (_addr == 0x43) return i2cR16(0x43, 0xA0)
        return i2cR16(0x39, 0x96)
    }

    /**
     * Read raw green channel value.
     */
    //% block="color green"
    export function green(): number {
        if (!_initialized) init()
        if (_addr == 0x43) return i2cR16(0x43, 0xA2)
        return i2cR16(0x39, 0x98)
    }

    /**
     * Read raw blue channel value.
     */
    //% block="color blue"
    export function blue(): number {
        if (!_initialized) init()
        if (_addr == 0x43) return i2cR16(0x43, 0xA4)
        return i2cR16(0x39, 0x9A)
    }

    /**
     * Read raw clear/intensity channel value.
     */
    //% block="color clear"
    export function clear(): number {
        if (!_initialized) init()
        if (_addr == 0x43) return i2cR16(0x43, 0xA6)
        return i2cR16(0x39, 0x94)
    }

    /**
     * Read all four channels at once. Returns "R,G,B,C" string.
     */
    //% block="color RGBC"
    export function rgbc(): string {
        return "" + red() + "," + green() + "," + blue() + "," + clear()
    }

    /**
     * Read normalized chromaticity + intensity.
     * Returns "r,g,b,I" where r=R/(R+G+B), g=G/(R+G+B), b=B/(R+G+B),
     * I=clear channel. Values are scaled to 0-1000 (milliunits) to
     * avoid floating point in the output string.
     */
    //% block="color normalized"
    export function normalized(): string {
        let R = red()
        let G = green()
        let B = blue()
        let I = clear()
        let sum = R + G + B
        if (sum == 0) return "0,0,0,0"
        let rn = Math.round(R * 1000 / sum)
        let gn = Math.round(G * 1000 / sum)
        let bn = Math.round(B * 1000 / sum)
        return "" + rn + "," + gn + "," + bn + "," + I
    }

    /**
     * Compute HSV from raw sensor RGB channels.
     * H: 0-360 (hue), S: 0-1000 (saturation in milliunits),
     * V: raw max channel value.
     * Returns -1 for H if no valid reading.
     */
    //% block="color hue"
    export function hue(): number {
        let r = red()
        let g = green()
        let b = blue()
        let mx = Math.max(r, Math.max(g, b))
        let mn = Math.min(r, Math.min(g, b))
        let delta = mx - mn
        if (mx == 0 || delta == 0) return -1

        let h = 0
        if (mx == r) {
            h = 60 * (g - b) / delta
            if (h < 0) h += 360
        } else if (mx == g) {
            h = 60 * (b - r) / delta + 120
        } else {
            h = 60 * (r - g) / delta + 240
        }
        return Math.round(h)
    }

    /**
     * Saturation (0-1000 milliunits) from raw RGB.
     */
    //% block="color saturation"
    export function saturation(): number {
        let r = red()
        let g = green()
        let b = blue()
        let mx = Math.max(r, Math.max(g, b))
        if (mx == 0) return 0
        let mn = Math.min(r, Math.min(g, b))
        return Math.round((mx - mn) * 1000 / mx)
    }

    /**
     * Value (brightness) — the max raw channel.
     */
    //% block="color value"
    export function value(): number {
        return Math.max(red(), Math.max(green(), blue()))
    }
}
