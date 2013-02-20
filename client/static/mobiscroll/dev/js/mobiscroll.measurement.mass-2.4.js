(function ($) {

    var defaults = {
            min: 0,
            max: 1000,
            convert: true,
            defUnit: 'kg',
            units: ['g', 'kg', 'oz', 'lb'],
            unitNames: {
                tlong: 't (long)',
                tshort: 't (short)'
            }
        },
        cobj = {
            mg: 0.001,
            cg: 0.01,
            dg: 0.1,
            g: 1,
            dag: 10,
            hg: 100,
            kg: 1000,
            t: 1000000,
            drc: 1.7718452,
            oz: 28.3495,
            lb: 453.59237,
            st: 6350.29318,
            qtr: 12700.58636,
            cwt: 50802.34544,
            tlong: 1016046.9088,
            tshort: 907184.74
        };

    $.mobiscroll.presetShort('mass');

    $.mobiscroll.presets.mass = function (inst) {
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
