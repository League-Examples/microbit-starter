// Color wheel — init, mapping on boot, button navigation.

announce.init("COLORWHEEL", "colors1")
app.hwInit()

serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    let line = serial.readUntil(serial.delimiters(Delimiters.NewLine))
    app.handleCommand(line)
})

// Button A = next color CW
input.onButtonPressed(Button.A, function () {
    app.nextColorCW()
})

// Button B = next color CCW
input.onButtonPressed(Button.B, function () {
    app.nextColorCCW()
})

basic.showIcon(IconNames.Giraffe)
serial.writeLine("READY")
