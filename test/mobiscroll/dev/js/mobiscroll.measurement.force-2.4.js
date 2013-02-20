(function ($) {

    var defaults = {
            min: 0,
            max: 100,
            convert: true,
            defUnit: 'N',
            units: ['N', 'kp', 'lbf', 'pdl']
        },
        cobj = {
            N: 1,
            kp: 9.80665,
            lbf: 4.448222,
            pdl: 0.138255
        };

    $.mobiscroll.presetShort('force');

    $.mobiscroll.presets.force = function (inst) {
        var s = $.extend({}, defaults, inst.settings),
            conv = s.convert,
            units = [],
            v,
            i;

        if (s.units) {
            for (i = 0; i < s.units.length; i++) {
                v = s.units[i]
                if (cobj[v]) {
                    units.push(v);
                }
            }
        }

        inst.settings = $.extend(s, {
            sign: false,
            units: units,
            unitNames: null,
            convert: function(val, unit1, unit2) {
                return conv ? val * cobj[unit1] / cobj[unit2] : val;
            }
        });

        return $.mobiscroll.presets.measurement.call(this, inst);
    };

})(jQuery);
