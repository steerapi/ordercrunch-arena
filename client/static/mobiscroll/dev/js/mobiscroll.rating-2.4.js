(function ($) {

    var defaults = {
        inputClass: '',
        values: 5,
        order: 'desc',
        style: 'star',
        invalid: []
    };

    $.mobiscroll.presetShort('rating');

    $.mobiscroll.presets.rating = function (inst) {
        var s = $.extend({}, defaults, inst.settings),
            elm = $(this),
            id = this.id + '_dummy',
            l1 = $('label[for="' + this.id + '"]').attr('for', id),
            l2 = $('label[for="' + id + '"]'),
            label = s.label !== undefined ? s.label : (l2.length ? l2.text() : elm.attr('name')),
            w = [{}],
            wheel = {},
            main = {},
            values = [],
            input,
            text = false,
            i,
            j,
            html,
            key,
            value,
            nr,
            N,
            style = s.style == 'grade' ? 'circle' : 'star'; // Currently supporting only two kinds of shapes

        function replace(str) {
            return str ? str.replace(/_/, '') : '';
        }

        input = null;

        if (elm.is('select')) {
            var n = $('option', elm).length;
            s.values = {};
            $('option', elm).each(function (index) { // Create text from the select options
                s.values[$(this).val()] = $(this).text();
            });
            // Create a textinput before the select, which will hold the selected value
            $('#' + id).remove();
        }

        if ($.isPlainObject(s.values)) {
            i = 1;
            text = true;
            for (var p in s.values) {
                nr = +p;
                if (isNaN(nr)) {
                    nr = i;
                }
                values.push({ order: nr, key: p, value: s.values[p] });
                i++;
            }
        } else if ($.isArray(s.values)) {
            for (i = 0; i < s.values.length; i++) {
                nr = +s.values[i];
                if (isNaN(nr)) {
                    nr = i + 1;
                    text = true;
                }
                values.push({ order: nr, key: s.values[i], value: s.values[i] });
            }
        } else {
            for (i = 1; i <= s.values; i++) {
                values.push({ order: i, key: i, value: i });
            }
        }

        if (s.showText === undefined && text) {
            s.showText = true;
        }

        values.sort(function(a, b) {
            return s.order == 'desc' ? b.order - a.order : a.order - b.order;
        });

        N = s.order == 'desc' ? values[0].order : values[values.length - 1].order; // Number of stars

        for (var i = 0; i < values.length; i++) {
            html = '';
            order = values[i].order;
            key = values[i].key;
            value = values[i].value;
            for (j = 1; j < order + 1; j++) {
                html += '<div class="rating-star-cont"><div class="rating-' + style + ' rating-filled-' + style + '">' + (style == 'circle' ? j : '') + '</div></div>';
            }
            for (j = order + 1; j <= N; j++) {
                html += '<div class="rating-star-cont"><div class="rating-' + style + ' rating-unfilled-' + style + '"></div></div>';
            }
            html += s.showText ? '<div class="rating-txt">' + value + '</div>' : "";

            wheel['_' + key] = html;
            main['_' + key] = value;
        }

        if (elm.is('select')) {
            input = $('<input type="text" id="' + id + '" value="' + main['_' + elm.val()] + '" class="' + s.inputClass + '" readonly />').insertBefore(elm);
        }

        w[0][label] = wheel;

        if (s.showOnFocus && input) {
            input.focus(function () {
                inst.show()
            });
        }

        if (elm.is('select')) {
            elm.hide().closest('.ui-field-contain').trigger('create');
        }

        return {
            height: (s.theme === 'wp' || s.theme === 'wp light') ? 76 : 40,
            wheels: w,
            headerText: false,
            formatResult: function (d) {
                return main[d[0]];
            },
            parseValue: function () {
                // Find the value
                var first;
                for (var i in main) {
                    if (first === undefined) {
                        first = i;
                    }
                    if ((input && i == '_' + elm.val()) || (!input && main[i] == elm.val())) {
                        return [i];
                    }
                }
                return [first];
            },
            validate: function (dw) {
                $.each(s.invalid, function (i, v) {
                    $('.dw-li[data-val="_' + v + '"]', dw).removeClass('dw-v');
                });
            },
            onSelect: function (v, inst) {
                if (input) {
                    input.val(v);
                    elm.val(replace(inst.values[0])).trigger('change');
                }
            },
            onChange: function (v, inst) {
                if (s.display == 'inline') {
                    if (input) {
                        input.val(v);
                        elm.val(replace(inst.values[0])).trigger('change');
                    }
                }
            },
            onClose: function () {
                if (input) {
                    input.blur();
                }
            }
        }
    };

})(jQuery);
