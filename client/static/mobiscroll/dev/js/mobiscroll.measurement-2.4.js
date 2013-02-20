(function ($) {

    var defaults = {
        batch: 50,
        min: 0,
        max: 100,
        defUnit: '',
        units: null,
        unitNames: null,
        invalid: [],
        sign: false,
        signText: '&nbsp;',
        wholeText: 'Whole',
        fractionText: 'Fraction',
        unitText: 'Unit',
        step: 0.05,
        convert: function(val) {
            return val;
        }
    }

    $.mobiscroll.presets.measurement = function (inst) {
        var s = $.extend({}, defaults, inst.settings),
            elm = $(this),
            wheel = {},
            w = [{}],
            fractions = [],
            batch = s.batch,
            batchStart,
            batchStop,
            useUnits = s.units && s.units.length,
            baseUnit = useUnits ? (s.defUnit || s.units[0]) : '',
            units = s.unitNames || s.units,
            useFract = s.step < 1,
            repFract = false,
            steps = Math.round(useFract ? s.step * 100 : s.step),
            realValue,
            oldUnit,
            oldWhole,
            idxSign = -1,
            idxFract,
            idxWhole,
            idxUnit,
            minVal,
            maxVal,
            minWhole,
            maxWhole,
            minFract,
            maxFract,
            j,
            l,
            i = 0;

        function getWhole(k) {
            return useFract ? (k < 0 ? Math.ceil(k) : Math.floor(k)) : step(Math.round(k), steps);
        }

        function getFract(k) {
            return useFract ? step((Math.abs(k) - getWhole(Math.abs(k))) * 100, steps) : 0;
        }

        function getParts(v) {
            var whole = getWhole(v),
                fract = getFract(v),
                sign = v < 0 ? '-' : '+';

            if (fract >= 100) {
                if (v < 0) {
                    whole--;
                }
                else {
                    whole++;
                }
                fract = 0;
            }
            return [sign, whole, fract];
        }

        function getNr(d) {
            var whole = replace(d[idxWhole]) - 0,
                fract = useFract ? (replace(d[idxFract]) / 100 * (whole < 0 ? -1 : 1)) : 0;
            return (s.sign && d[0] == '-' ? -1 : 1) * (whole + fract);
        }

        function step(v, st) {
            return Math.round(v / st) * st;
        }

        function pad(num, size) {
            num = num + '';
            while (num.length < size) {
                num = '0' + num;
            }
            return num;
        }

        function replace(str) {
            if (str) {
                return str.replace(/_|\+|\-/g, '');
            }
            return '';
        }

        function convert(v, u1, u2) {
            if (u1 === u2) {
                return v;
            }
            return s.convert.call(this, v, u1, u2);
        }

        function constrain(val, min, max) {
            val = val > max ? max : val;
            val = val < min ? min : val;
            return val;
        }

        function setMinMax(unit) {
            minVal = convert(s.min, baseUnit, unit);
            maxVal = convert(s.max, baseUnit, unit)
            minWhole = getWhole(minVal);
            maxWhole = getWhole(maxVal);
            minFract = getFract(minVal);
            maxFract = getFract(maxVal);
            if (maxFract >= 100) {
                maxWhole++;
                maxFract = 0;
            }
        }

        function genWholeWheel(unit, val) {
            // Whole wheel
            setMinMax(unit);
            wheel = {};

            var min = minWhole,
                max = maxWhole,
                st = useFract ? 1 : steps,
                start,
                stop;

            if (s.sign) {
                max = Math.abs(min) > Math.abs(max) ? Math.abs(min) : Math.abs(max);
                min = min < 0 ? 0 : min;
            }

            start = val - batch * st,
            start = start < min ? min : start;
            stop = start + batch * st * 2;
            stop = stop > max ? max : stop;

            if (start !== batchStart || stop !== batchStop) {
                for (j = start; j <= stop; j += st) {
                    wheel['_' + j] = j;
                }
                w[0][s.wholeText] = wheel;
                batchStart = start;
                batchStop = stop;
                return true;
            }
            return false; // Don't change the wheel if start and stop is the same
        }

        function genFractWheel(val) {
            if (repFract) {
                wheel = {};

                var l = fractions.length,
                    offset = $.inArray(+val, fractions),
                    rep,
                    k,
                    i;

                for (j = -50; j < 50; j++) {
                    k = (j + offset) % l;
                    i = fractions[k < 0 ? l + k : k];
                    rep = Math.abs(Math.floor((j + offset) / l));
                    wheel['_' + Array(rep).join(j + offset < 0 ? '-' : '+') + i] = '.' + pad(i, 2);
                }
      
                w[0][s.fractionText] = wheel;
            }
        }

        // Sign wheel (if enabled)
        if (s.sign) {
            wheel = {
                '-': '-',
                '+': '+'
            };
            w[0][s.signText] = wheel;
            idxSign = i++;
        }

        // Whole wheel (later generated)
        w[0][s.wholeText] = {};
        idxWhole = i++;

        // Fraction wheel
        if (useFract) {
            wheel = {};
            for (j = 0; j < 100; j += steps) {
                fractions.push(j);
                wheel['_' + j] = '.' + pad(j, 2);
            }
            repFract = fractions.length > s.rows;
            w[0][s.fractionText] = repFract ? {} : wheel;
            idxFract = i++;
        }

        // Unit wheel
        if (useUnits) {
            wheel = {};
            for (j = 0; j < s.units.length; j++) {
                wheel[j] = units[j];
            }
            w[0][s.unitText] = wheel;
        }
        idxUnit = i;

        return {
            width: 55,
            wheels: w,
            formatResult: function (d) {
                return getNr(d).toFixed(2) + (useUnits ? ' ' + units[d[idxUnit]] : '');
            },
            parseValue: function (v) {
                var d = v.split(' '),
                    val = +d[0],
                    ret = [],
                    parts,
                    unit = '';

                if (useUnits) {
                    unit = $.inArray(d[1], units);
                    unit = unit == -1 ? $.inArray(baseUnit, s.units) : unit;
                    unit = unit == -1 ? 0 : unit;
                }

                setMinMax(useUnits ? s.units[unit] : '');

                val = isNaN(val) ? 0 : val;

                parts = getParts(val);

                parts[1] = constrain(parts[1], minWhole, maxWhole);

                if (s.sign) {
                    ret[0] = parts[0];
                    parts[1] = Math.abs(parts[1]);
                }

                ret[idxWhole] = '_' + parts[1];

                if (useFract) {
                    ret[idxFract] = '_' + parts[2];
                }

                if (useUnits) {
                    ret[idxUnit] = unit;
                }

                return ret;
            },
            onBeforeShow: function() {
                genWholeWheel(useUnits ? s.units[inst.temp[idxUnit]] : '', replace(inst.temp[idxWhole]));
                genFractWheel(replace(inst.temp[idxFract]));
            },
            onCancel: function () {
                realValue = undefined;
            },
            validate: function (dw, i) {
                var temp = inst.temp,
                    changes = [],
                    parts,
                    whole,
                    t,
                    fract = replace(temp[idxFract]) - 0,
                    newUnit = useUnits ? s.units[temp[idxUnit]] : '';

                if (s.sign && i === 0) { // Sign changed
                    realValue = Math.abs(realValue) * (temp[i] === '-' ? -1 : 1);
                    changes = useFract && repFract ? [idxWhole, idxFract] : [idxWhole];
                }

                if (i === idxWhole || (i === idxFract && useFract) || realValue === undefined) { // Set real value if numbers changed
                    realValue = getNr(temp);
                }

                if (useUnits && i === idxUnit && oldUnit !== newUnit) { // Convert value if unit changed
                    realValue = convert(realValue, oldUnit, newUnit);
                    parts = getParts(realValue);

                    // Change wheel
                    genWholeWheel(newUnit, s.sign ? Math.abs(parts[1]) : parts[1]);
                    genFractWheel(fract);
                    inst.changeWheel(repFract ? [idxWhole, idxFract] : [idxWhole], 0.2);
                    return false;
                }

                realValue = constrain(realValue, minVal, maxVal);
                parts = getParts(realValue);
                whole = s.sign ? Math.abs(parts[1]) : parts[1];

                if (s.sign) {
                    temp[0] = parts[0];
                }

                temp[idxWhole] = '_' + whole;

                if (useFract) {
                    temp[idxFract] = '_' + parts[2];
                }

                if (i === idxWhole && oldWhole !== whole) { // Load whole wheel in batches
                    changes.push(idxWhole);
                }

                if (i === idxFract && repFract) {
                    changes.push(idxFract)
                }

                if (changes.length) {
                    genWholeWheel(newUnit, whole);
                    genFractWheel(fract);
                    inst.changeWheel(changes);
                    return false;
                }

                if (s.sign && i === undefined) { // Disable +/- signs
                    t = $('.dw-ul', dw).eq(idxSign);
                    $('.dw-li', t).addClass('dw-v');
                    if (minVal > 0) {
                        $('.dw-li', t).eq(0).removeClass('dw-v');
                    }
                    if (maxVal < 0) {
                        $('.dw-li', t).eq(1).removeClass('dw-v');
                    }
                }

                if (s.sign && !i) { // Disable out of range whole values if sign changed or initial validation
                    t = $('.dw-ul', dw).eq(idxWhole);
                    $('.dw-li', t).addClass('dw-v');
                    j = $('.dw-li', t).index($('.dw-li[data-val="_' + Math.abs(realValue < 0 ? minWhole : maxWhole) + '"]', t));
                    if (j != -1) {
                        $('.dw-li', t).slice(j + 1).removeClass('dw-v');
                    }
                }

                if (i !== idxFract && useFract /*|| fract < 0 || fract >= 100*/) {
                    t = $('.dw-ul', dw).eq(idxFract);
                    $('.dw-li', t).addClass('dw-v');

                    // Disable out of range fraction values
                    if (parts[1] == minWhole /* || parts[1] == minWhole + 1*/) {
                        $('.dw-li', t).each(function() {
                            if (replace($(this).attr('data-val')) < minFract) {
                                $(this).removeClass('dw-v');
                            }
                        });
                    }
                    if (parts[1] == maxWhole /* || parts[1] == maxWhole - 1*/) {
                        $('.dw-li', t).each(function() {
                            if (replace($(this).attr('data-val')) > maxFract) {
                                $(this).removeClass('dw-v');
                            }
                        });
                    }

                    for (var i = 0; i < s.invalid.length; i++) { // Disable user values
                        var cparts = getParts(convert(s.invalid[i], baseUnit, newUnit));

                        if (parts[0] === cparts[0] && parts[1] === cparts[1]) { // Sign and whole part matches
                            //$('.dw-ul', dw).eq(idxFract).find('.dw-li[data-val="_' + cparts[2] + '"]').removeClass('dw-v');
                            $('.dw-li', t).each(function() {
                                if (replace($(this).attr('data-val')) == cparts[2]) {
                                    $(this).removeClass('dw-v');
                                }
                            });
                        }
                    }
                }

                if (!useFract) { // Disable user values on whole wheel
                    t = $('.dw-ul', dw).eq(idxWhole);
                    for (var i = 0; i < s.invalid.length; i++) {
                        $('.dw-li[data-val="_' + step(convert(s.invalid[i], baseUnit, newUnit), steps) + '"]', t).removeClass('dw-v');
                    }
                }

                // Set current unit
                oldUnit = newUnit;
                oldWhole = whole;
            }
        }
    };

})(jQuery);
