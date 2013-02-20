(function ($) {

    var defaults = {
            min: 0,
            max: 100,
            convert: true,
            defUnit: 'km',
            units: ['m', 'km', 'in', 'ft', 'yd', 'mi']
        },
        cobj = {
            mm: 0.001,
            cm: 0.01,
            dm: 0.1,
            m: 1,
            dam: 10,
            hm: 100,
            km: 1000,
            'in': 0.0254,
            ft: 0.3048,
            yd: 0.9144,
            ch: 20.1168,
            fur: 201.168,
            mi: 1609.344,
            lea: 4828.032
        };

    $.mobiscroll.presetShort('distance');

    $.mobiscroll.presets.distance = function (inst) {
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
