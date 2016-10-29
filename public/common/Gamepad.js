var Gamepad = {
    get: function (i) {
        var gamepads = navigator.getGamepads();
        return gamepads[i];
    }
};

window.addEventListener("gamepadconnected", function(e) {
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons, e.gamepad.axes);
});



