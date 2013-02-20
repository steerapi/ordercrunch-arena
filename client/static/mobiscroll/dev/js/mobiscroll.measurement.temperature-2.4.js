(function ($) {

    var defaults = {
            min: -20,
            max: 40,
            convert: true,
            defUnit: 'c',
            units: ['c', 'k', 'f', 'r'],
            unitNames: {
                c: '°C',
                k: '°K',
                f: '°F',
                r: '°R'
            }
        },
        valid = {
            c: 1,
            k: 1,
            f: 1,
            r: 1
        },
        cobj = {
            c2k: function (c) {
                return c + 273.15;
            },
            c2f: function (c) {
                return c * 9 / 5 + 32;
            },
            c2r: function (c) {
                return (c + 273.15) * 9 / 5;
            },
            k2c: function (k) {
                return k - 273.15;
            },
            k2f: function (k) {
                return k * 9 / 5 - 459.67;
            },
            k2r: function (k) {
                return k * 9 / 5;
            },
            f2c: function (f) {
                return (f - 32) * 5 / 9;
            },
            f2k: function (f) {
                return (f + 459.67) * 5 / 9;
            },
            f2r: function (f) {
                return f + 459.67;
            },
            r2c: function (r) {
                return (r - 491.67) * 5 / 9;
            },
            r2k: function (r) {
                return r * 5 / 9;
            },
            r2f: function (r) {
                return r - 459.67;
            }
        };

    $.mobiscroll.presetShort('temperature');

    $.mobiscroll.presets.temperature = function (inst) {
        var s = $.extend({}, defaults, inst.settings),
            conv = s.convert,
            units = [],
            unitNames = [],
            v,
            i;

        if (s.units) {
            for (i = 0; i < s.units.length; i++) {
                v = s.units[i]
                if (valid[v]) {
                    units.push(v);
                    unitNames.push(s.unitNames[v] || v);
                }
            }
        }

        inst.settings = $.extend(s, {
            sign: true,
            units: units,
            unitNames: unitNames,
            convert: function(val, unit1, unit2) {
                return conv ? cobj[unit1 + '2' + unit2](val) : val;
            }
        });

        return $.mobiscroll.presets.measurement.call(this, inst);
    };

})(jQuery);
