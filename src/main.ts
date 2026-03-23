// Template demo — buttons send serial, serial commands show images and play notes.
//
// Buttons:
//   A pressed → sends "BUTTON A"
//   B pressed → sends "BUTTON B"
//
// Serial commands:
//   SHOW <icon>        — display an icon (Heart, Happy, Sad, Yes, No, Duck, Giraffe)
//   NOTE <freq> <ms>   — play a tone (e.g. NOTE 440 500)
//   READ               — report button state

announce.init("DEMO", "template")

input.onButtonPressed(Button.A, function () {
    serial.writeLine("BUTTON A")
})

input.onButtonPressed(Button.B, function () {
    serial.writeLine("BUTTON B")
})

serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    let line = serial.readUntil(serial.delimiters(Delimiters.NewLine))
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

    if (cmd == "SHOW") {
        if (arg == "Heart") basic.showIcon(IconNames.Heart)
        else if (arg == "Happy") basic.showIcon(IconNames.Happy)
        else if (arg == "Sad") basic.showIcon(IconNames.Sad)
        else if (arg == "Yes") basic.showIcon(IconNames.Yes)
        else if (arg == "No") basic.showIcon(IconNames.No)
        else if (arg == "Duck") basic.showIcon(IconNames.Duck)
        else if (arg == "Giraffe") basic.showIcon(IconNames.Giraffe)
        else serial.writeLine("ERR:unknown icon " + arg)
    } else if (cmd == "NOTE") {
        let parts = arg.indexOf(" ")
        if (parts < 0) {
            serial.writeLine("ERR:NOTE needs freq and duration")
        } else {
            let freq = parseInt(arg.substr(0, parts))
            let dur = parseInt(arg.substr(parts + 1))
            music.playTone(freq, dur)
        }
    } else if (cmd == "READ") {
        serial.writeLine("STATE OK")
    } else if (announce.handleHello(line)) {
        // handled
    } else {
        serial.writeLine("ERR:" + cmd)
    }
})

basic.showIcon(IconNames.Heart)
serial.writeLine("READY")
