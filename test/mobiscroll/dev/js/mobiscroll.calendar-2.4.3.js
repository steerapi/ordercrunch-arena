/*jslint eqeq: true, plusplus: true, undef: true, sloppy: true, vars: true, forin: true */
(function ($) {

    var defaults = {
        controls: ['time', 'calendar'],
        firstDay: 0,
        swipe: true,
        prevText: 'Prev',
        nextText: 'Next',
        onDayChange: function () { }
    };

    $.mobiscroll.presetShort('calendar');

    $.mobiscroll.presets.calendar = function (inst) {
        
        function isValid(d) {
            if (d < new Date(minDateTime.getFullYear(), minDateTime.getMonth(), minDateTime.getDate())) {
                return false;
            }
            
            if (d > maxDateTime) {
                return false;
            }
            
            return !isInObj(d, s.invalid);
        }
        
        function isInObj(d, obj) {
            var i, v, x, y;
            
            if (obj) {
                // Disable exact dates
                if (obj.dates) {
                    for (i = 0; i < obj.dates.length; i++) {
                        x = obj.dates[i];
                        y = x.d || x;
                        if (y.getTime() === d.getTime()) {
                            return x;
                        }
                    }
                }
                
                // Disable days of month
                if (obj.daysOfMonth) {
                    for (i = 0; i < obj.daysOfMonth.length; i++) {
                        x = obj.daysOfMonth[i];
                        y = x.d || x;
                        v = (y + '').split('/');
                        if (v[1]) {
                            if (v[0] - 1 == d.getMonth() && v[1] == d.getDate()) {
                                return x;
                            }
                        } else {
                            if (v[0] == d.getDate()) {
                                return x;
                            }
                        }
                    }
                }
                
                // Disable days of week
                if (obj.daysOfWeek) {
                    for (i = 0; i < obj.daysOfWeek.length; i++) {
                        x = obj.daysOfWeek[i];
                        y = x.d || x;
                        if (y === d.getDay()) {
                            return x;
                        }
                    }
                }
            }
            return false;
        }
        
        function genMonth(year, month) {
            var curr,
                valid,
                other,
                i,
                j,
                sel = inst.getDate(inst.temp),
                days = new Date(year, month + 1, 0).getDate(),
                w = new Date(year, month, 1).getDay(), // Get the weekday of the month
                prev = new Date(year, month, 0).getDate() - w + 1,
                html = '<div class="dw-cal-slide"><table cellpadding="0" cellspacing="0">';
            
            //for (i = 0; i < Math.ceil((days + w) / 7) * 7; i++) {
            for (j = 0; j < 42; j++) {
                i = j + s.firstDay;
                curr = new Date(year, month, i - w + 1);
                valid = isValid(curr);
                marked = isInObj(curr, s.marked);
                other = i < w || i >= days + w; // Day is from another month
                
                if (j % 7 == 0) {
                    html += (j ? '</tr>' : '') + '<tr>';
                }

                html += '<td class="dw-cal-day' +
                    (jqm ? ' ui-body-c' : '') +
                    (valid && other ? ' dw-cal-day-diff' : '') +
                    (valid ? ' dw-cal-day-v' : '') + '" data-date="' + (i - w + 1) + '"><div class="dw-cal-day-i' + (valid && jqm ? ' ui-btn-up-c ui-state-default ui-btn" data-theme="c"' : '"') + '>' +
                    (i < w ? prev + i : (i >= days + w ? i - days - w + 1 : i - w + 1)) +
                    (marked ? '<div class="dw-cal-day-m"></div>' : '') +
                    (marked && marked.text ? '<div class="dw-cal-day-txt">' + marked.text + '</div>' : '') +
                    '</div></td>';
            }

            html += '</tr></table></div>';
            
            $('.dw-cal-my', ctx).text(s.monthNames[month] + ' ' + year);
            
            // Disable/enable prev/next buttons
            if (new Date(year, month - 1, 1) < minDate) {
                $('.dw-cal-prev', ctx).addClass(disabled);
            } else {
                $('.dw-cal-prev', ctx).removeClass(disabled);
            }
            if (new Date(year, month + 1, 1) > maxDate) {
                $('.dw-cal-next', ctx).addClass(disabled);
            } else {
                $('.dw-cal-next', ctx).removeClass(disabled);
            }
            
            return html;
        }
        
        function highlightDate() {
            d = inst.getDate(inst.temp);
            
            if (d.getFullYear() === currYear && d.getMonth() === currMonth) {
                $('.dw-cal-day-sel', ctx).removeClass('dw-cal-day-sel');
                $('.dw-cal-week-hl', ctx).removeClass('dw-cal-week-hl');
                $('.dw-cal-day[data-date="' + d.getDate() + '"]', ctx).addClass('dw-cal-day-sel');
                
                var tr = $('.dw-cal-day-sel', ctx).parent();
                
                if (tr) {
                    tr.addClass('dw-cal-week-hl');
                }
                
                if (jqm) {
                    $('.dw-cal .ui-btn-active', ctx).removeClass('ui-btn-active');
                    $('.dw-cal-day-sel .dw-cal-day-i', ctx).addClass('ui-btn-active');
                }
            }
        }
        
        function setDate() {
            d = inst.getDate(inst.temp);
                
            // Update calendar to the new month
            if (d.getFullYear() === currYear && d.getMonth() === currMonth) {
                currDate = d;
                highlightDate();
            } else if (d > currDate) {
                currYear = d.getFullYear();
                currMonth = d.getMonth();
                changeMonthNext();
            } else if (d < currDate) {
                currYear = d.getFullYear();
                currMonth = d.getMonth();
                changeMonthPrev();
            }
        }
        
        function changeMonthPrev() {
            currDate = new Date(currYear, currMonth, 1);
            currYear = currDate.getFullYear();
            currMonth = currDate.getMonth();
            oldMonth = $('.dw-cal-slide', ctx);
            newMonth = genMonth(currDate.getFullYear(), currDate.getMonth());
            anim.addClass('dw-cal-anim-prev').prepend(newMonth);
            highlightDate();
            trans = true;
            setTimeout(function () {
                anim.addClass('dw-cal-anim-a').removeClass('dw-cal-anim-prev');
                setTimeout(function () {
                    anim.removeClass('dw-cal-anim-a');
                    oldMonth.remove();
                    trans = false;
                }, 300);
            }, 10);
        }
        
        function changeMonthNext() {
            currDate = new Date(currYear, currMonth, 1);
            currYear = currDate.getFullYear();
            currMonth = currDate.getMonth();
            oldMonth = $('.dw-cal-slide', ctx);
            newMonth = genMonth(currDate.getFullYear(), currDate.getMonth());
            anim.append(newMonth).addClass('dw-cal-anim-a');
            highlightDate();
            //setTimeout(function () {
            anim.addClass('dw-cal-anim-prev');
            trans = true;
            setTimeout(function () {
                anim.removeClass('dw-cal-anim-a').removeClass('dw-cal-anim-prev');
                oldMonth.remove();
                trans = false;
            }, 300);
            //}, 10);
        }
        
        function selectDay() {
            var fill = s.display === 'inline';
            d = inst.getDate(inst.temp);
            inst.setDate(new Date(currYear, currMonth, $(this).attr('data-date'), d.getHours(), d.getMinutes(), d.getSeconds()), fill, 0.2, !fill);
            
            // Call onDayChange event
            s.onDayChange.call(that, { date: d, marked: $('.dw-cal-day-m', this).length > 0, cell: this }, inst);
        }
        
        function getX(e) {
            var org = e.originalEvent,
                ct = e.changedTouches;
            return ct || (org && org.changedTouches) ? (org ? org.changedTouches[0].pageX : ct[0].pageX) : e.pageX;
    
        }
        
        var d,
            ret,
            ctx,
            anim,
            html,
            oldMonth,
            newMonth,
            minDate,
            maxDate,
            minDateTime,
            maxDateTime,
            currDate,
            currYear,
            currMonth,
            controls,
            highlight,
            that = this,
            touch = false,
            move = false,
            trans = false,
            visible = false,
            s = $.extend({}, defaults, inst.settings),
            jqm = s.theme == 'jqm',
            disabled = 'dw-cal-btn-d' + (jqm ? ' ui-disabled' : '');
        
        controls = s.controls.join(',');
        
        inst.settings.preset = 'date' + (controls.match(/time/) ? 'time' : '');
        
        inst._setValue = inst.setValue;
        inst.setValue = function () {
            inst._setValue.apply(this, arguments);
            if (visible) {
                setDate();
            } else {
                currDate = inst.getDate(inst.temp);
            }
        };
        
        ret = $.extend(s, $.mobiscroll.presets.datetime.call(this, inst));

        $.extend(ret, {
            onMarkupReady: function (dw) {
                ctx = dw;
                visible = true;
                d = inst.getDate(inst.temp);
                s = $.extend({}, defaults, inst.settings);
                
                currDate = d;
                currYear = d.getFullYear();
                currMonth = d.getMonth();
                
                if (s.minDate) {
                    minDate = new Date(s.minDate.getFullYear(), s.minDate.getMonth(), 1);
                    minDateTime = s.minDate;
                } else {
                    minDate = new Date(s.startYear, 0, 1);
                    minDateTime = minDate;
                }
                
                if (s.maxDate) {
                    maxDate = new Date(s.maxDate.getFullYear(), s.maxDate.getMonth(), 1);
                    maxDateTime = s.maxDate;
                } else {
                    maxDate = new Date(s.endYear, 11, 31, 23, 59, 59);
                    maxDateTime = maxDate;
                }
                
                dw.addClass('dw-calendar');
                
                if (!controls.match(/date/)) {
                    $('.dwc', ctx).eq(0).addClass('dwc-h');
                    //$('.dwc', ctx).eq(-1).addClass('dwc1 dwc2');
                } else {
                    //$('.dwc', ctx).eq(0).addClass('dwc1');
                    //$('.dwc', ctx).eq(-1).addClass('dwc2');
                }

                html = '<div class="dwc dw-cal-c"><div class="dw-cal">' +
                    '<div class="dw-cal-header' + (jqm ? ' ui-body-c' : '') + '"><div class="dw-cal-btnc">' +
                    '<div class="dw-cal-prev dw-cal-btn dwb"><div class="dw-cal-btn-txt"' + (jqm ? 'data-role="button" data-icon="arrow-l" data-iconpos="notext"' : '') + '>' + s.prevText + '</div></div>' +
                    '<span class="dw-cal-my">' + s.monthNames[currMonth] + ' ' + currYear + '</span>' +
                    '<div class="dw-cal-next dw-cal-btn dwb"><div class="dw-cal-btn-txt"' + (jqm ? 'data-role="button" data-icon="arrow-r" data-iconpos="notext"' : '') + '>' + s.nextText + '</div></div></div>' +
                    '<table cellpadding="0" cellspacing="0"><tr>';
                
                for (i = 0; i < 7; i++) {
                    html += '<th>' + s.dayNamesShort[(i + s.firstDay) % 7] + '</th>';
                }
                
                html += '</tr></table></div><div class="dw-cal-anim-c"><div class="dw-cal-anim"></div></div><div class="dw-cal-f"></div></div></div>';
                
                $('.dwcc, .dwbc', ctx).before(html);
                
                anim = $('.dw-cal-anim', ctx);
                                
                anim.html(genMonth(currYear, currMonth))
                    .delegate('.dw-cal-day-v', 'touchstart mousedown', function (e) {
                        $(this).addClass('dwb-a');
                    })
                    .delegate('.dw-cal-day-v', 'touchstart', function (e) {
                        move = false;
                        touch = true;
                    })
                    .delegate('.dw-cal-day-v', 'touchmove', function (e) {
                        clearTimeout(highlight);
                        move = true;
                    })
                    .delegate('.dw-cal-day-v', 'touchend', function (e) {
                        if (!move) {
                            selectDay.call(this);
                        }
                    })
                    .delegate('.dw-cal-day-v', 'click', function (e) {
                        if (!touch) {
                            selectDay.call(this);
                        }
                    });
               
                $('.dw-cal-prev', ctx)
                    .bind('touchstart', function (e) {
                        e.preventDefault();
                        move = false;
                        touch = true;
                    })
                    .bind('touchmove', function () {
                        move = true;
                    })
                    .bind('touchend', function () {
                        if (!move && !trans && !$(this).hasClass('dw-cal-btn-d')) {
                            currMonth--;
                            changeMonthPrev.call(this);
                        }
                    })
                    .bind('click', function () {
                        if (!touch && !trans && !$(this).hasClass('dw-cal-btn-d')) {
                            currMonth--;
                            changeMonthPrev.call(this);
                        }
                    });
                
                $('.dw-cal-next', ctx)
                    .bind('touchstart', function (e) {
                        e.preventDefault();
                        $(this).addClass('dwb-a');
                        move = false;
                        touch = true;
                    })
                    .bind('touchmove', function () {
                        move = true;
                    })
                    .bind('touchend', function () {
                        if (!move && !trans && !$(this).hasClass('dw-cal-btn-d')) {
                            currMonth++;
                            changeMonthNext.call(this);
                        }
                    })
                    .bind('click', function () {
                        if (!touch && !trans && !$(this).hasClass('dw-cal-btn-d')) {
                            currMonth++;
                            changeMonthNext.call(this);
                        }
                    });
                
                // Change month on swipe
                if (s.swipe) {
                    
                    var startX,
                        endX,
                        startTime,
                        endTime;
                    
                    $('.dw-cal-anim-c', ctx)
                        .bind('touchstart mousedown', function (e) {
                            e.preventDefault();
                            startTime = new Date();
                            startX = getX(e);
                        })
                        .bind('touchend mouseup', function (e) {
                            endTime = new Date();
                            endX = getX(e);
                            // If duration is more than 500ms, it's not a swipe
                            if (endTime - startTime > 300) {
                                return;
                            }
                            
                            if (endX - startX > 30 && !$('.dw-cal-prev', ctx).hasClass('dw-cal-btn-d')) {
                                currMonth--;
                                changeMonthPrev.call(this);
                            } else if (endX - startX < -30 && !$('.dw-cal-next', ctx).hasClass('dw-cal-btn-d')) {
                                currMonth++;
                                changeMonthNext.call(this);
                            }
                        });
                }
              
                // Highlight initial day and week
                setDate();
            },
            onClose: function () {
                visible = false;
            },
            onChange: setDate
        });

        return ret;
    };

})(jQuery);
