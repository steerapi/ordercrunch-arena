(function ($) {

    var defaults = {
            min: 0,
            max: 100,
            convert: true,
            defUnit: 'kph',
            units: ['kph', 'mph', 'mps', 'fps', 'knot'],
            unitNames: {
                kph: 'km/h',
                mph: 'mi/h',
                mps: 'm/s',
                fps: 'ft/s',
                knot: 'knot'
            }
        },
        cobj = {
            kph: 1,
            mph: 1.60934,
            mps: 3.6,
            fps: 1.09728,
            knot: 1.852
        };

    $.mobiscroll.presetShort('speed');

    $.mobiscroll.presets.speed = function (inst) {
        var s = $.extend({}, defaults, inst.settings),
            conv = s.convert,
            units = [],
            unitNames = [],
            v,
            i;

        if (s.units) {
            for (i = 0; i < s.units.length; i++) {
                v = s.units[i]
                if (cobj[v]) {
                    units.push(v);
                    unitNames.push(s.unitNames[v] || v);
                }
            }
        }

        inst.settings = $.extend(s, {
            sign: false,
            units: units,
            unitNames: unitNames,
            convert: function(val, unit1, unit2) {
                return conv ? val * cobj[unit1] / cobj[unit2] : val;
            }
        });

        return $.mobiscroll.presets.measurement.call(this, inst);
    };

})(jQuery);
