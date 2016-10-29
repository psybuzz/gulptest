function StandardControls() {
    
}

StandardControls.prototype = {
    // event, callback, sensitivity
    // .on('forward', () => { position += 1 }, 0.8);
    on: function(event, cb, sensitivity){
        if (typeof this[event] !== "function")
            return;
        var status = this[event]();
        if (status && (!sensitivity || status >= sensitivity))
            cb(status);
    },

    forward: function(){
        var g = Gamepad.get(0);
        if (g)
            return -g.axes[1];
        return Key.isPressed("S") ? -1 : (Key.isPressed("W") ? 1 : 0);
    },

    strafe: function(){
        var g = Gamepad.get(0);
        if (g)
            return g.axes[0];
        return Key.isPressed("A") ? -1 : (Key.isPressed("D") ? 1 : 0);
    },

    turn: function(){
        var g = Gamepad.get(0);
        if (g)
            return g.axes[2];
        return Key.isPressed("LEFT") ? -1 : (Key.isPressed("RIGHT") ? 1 : 0);
    },

    raise: function(){
        var g = Gamepad.get(0);
        if (g)
            return -g.axes[3];
        return Key.isPressed("DOWN") ? -0.5 : (Key.isPressed("UP") ? 0.5 : 0);
    },

    circle: function(){
        var g = Gamepad.get(0);
        if (g)
            return g.buttons[1].pressed;
        return Key.isPressed("SPACE");
    },

    cross: function(){
        var g = Gamepad.get(0);
        if (g)
            return g.buttons[0].pressed;
        return Key.isPressed("SHIFT");
    },

    triangle: function(){
        var g = Gamepad.get(0);
        if (g)
            return g.buttons[3].pressed;
        return Key.isPressed("SHIFT");
    },

    square: function(){
        var g = Gamepad.get(0);
        if (g)
            return g.buttons[2].pressed;
        return Key.isPressed("SHIFT");
    },

    defaultActions: function(){
        var g = Gamepad.get(0);
        if (g && g.buttons[16].pressed)
            window.location.reload();
    }
}

