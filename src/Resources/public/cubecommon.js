/* CubeTools CubeCommonBundle */
if (typeof(cubetools) === 'undefined') {
    cubetools = {};
}

(function () {
    cubetools.colsSelector || ( cubetools.colsSelector = {} );

    var cs = cubetools.colsSelector;

    cs.updateCols = function(table, hidableSettings)
    {
        if (typeof(hidableSettings) === 'undefined') {
            var btnId = table.find('.colsSelector').first().attr('id');
            hidableSettings = cs.getHidableSettings(btnId);
        }

        var cols = table.find('td, th, col');
        cols.each(function () {
            var colId = $(this).attr('id');
            if (hidableSettings[colId]) {
                cs.updateOneCol(colId, hidableSettings[colId].hidden);
            }
        });
    };

    cs.updateOneCol = function(colId, hide)
    {
        if (hide) {
            $("." + colId).hide();
        } else {
            $("." + colId).show();
        }
    };

    var tableSettings = {};
    var columnStyle = null;

    const SET_ID_LATER = true;

    /**
     * Check if id matches "col[A-Z].*", for initializeColsSelection().
     *
     * @param {jQuery} col topmost cell (td/th) of column
     *
     * @returns {String|null}
     */
    var isMatchingIdColXx = function (col)
    {
        if (col.is('[id^=col]') && col.attr('id').charAt(3).toUpperCase() === col.attr('id').charAt(3)) {
            return col.attr('id');
        }
        return null;
    };

    /**
     * Check if id matches ".*Col", for initializeColsSelection().
     *
     * @param {jQuery} col topmost cell (td/th) of column
     *
     * @returns {String|null}
     */
    var isMatchingIdXCol = function (col)
    {
        if (col.is('[id$=Col]')) {
            return col.attr('id');
        }
        return null;
    };

    /**
     * Check if class matches ".*Col", for initializeColsSelection().
     *
     * @param {jQuery} col topmost cell (td/th) of column
     *
     * @returns {String|null}
     */
    var isMatchingClassXCol = function (col)
    {
        if (col.is('[class$=Col]')) {
            return SET_ID_LATER;
        }
        return null;
    };

    /**
     * Check if class is the specified one, for initializeColsSelection().
     *
     * @param {String} className name of the class to check for
     * @param {jQuery} col       topmost cell (td/th) of column
     *
     * @returns {String|null}
     */
    var isMatchingClass = function (className, col)
    {
        if (col.hasClass(className)) {
            return SET_ID_LATER;
        }
        return null;
    };

    cs.initializeColsSelection = function (settingsOfTables, columnType)
    {
        // initialize selectors
        var styleNode = $('<style type="text/css" title="colHideStyles">');
        $(document.head).append(styleNode);
        columnStyle = styleNode[0].sheet;
        var selectorBtns = $('.colsSelector');
        var matchFn, markClassName;
        switch (columnType) {
            case '':
            case 'id_colXx':
                matchFn = isMatchingIdColXx;
                break;
            case 'id_xCol':
                matchFn = isMatchingIdXCol;
                break;
            case 'class_xCol':
                matchFn = isMatchingClassXCol;
                break;
            default:
                if (0 === columnType.indexOf('class_')) { // ~startsWith
                    markClassName = columnType.substring(6);
                    matchFn = function (col) {
                        return isMatchingClass(markClassName, col);
                    };
                } else {
                    console.error('Config error: column type "' + columnType + '" is not supported!');
                    return;
                }
        }
        selectorBtns.each(function () {
            var btn = $(this);
            var id = btn.attr('id') || '';
            if (settingsOfTables[id] && null !== settingsOfTables[id].settings) {
                var setSettings = settingsOfTables[id].settings;
            } else {
                var setSettings = {};
            }
            var tbl = btn.closest('table');
            if (!tbl.attr('id')) {
                var tblNr;
                if (!tblNr) {
                    tblNr = Math.floor(Math.random() * 1024);
                }
                tbl.attr('id', 'tblColSel' + ++tblNr);
            }
            var tblSel = '#' + tbl.attr('id');
            var settings = {}; // own variable for keeping the column order
            var tblColgroup = tbl.find('colgroup');
            if (0 === tblColgroup.length) {
                tbl.prepend('<colgroup>');
                tblColgroup = tbl.find('colgroup');
            }
            var colNo = 0;
            tbl.find('tr').eq(0).children('td, th').each( function(/*i*/) {
                var col = $(this);
                var cellColspan = col.attr('colspan');
                if ('undefined' === typeof cellColspan) {
                    cellColspan = 1;
                }
                for (var i = 0; i < cellColspan; ++i) {
                    tblColgroup.append('<col>');
                }

                if (col.hasClass('noHideCol') || col.is('[style*=visibility]')) { // skip this
                } else {
                    colId = matchFn(col);
                }
                if (colId) {
                    var colSel, colGroupSel;
                    var matchColClassFn;
                    if (col.is('[class$=Col]')) {
                        matchColClassFn = function(candidateClass) {
                            return candidateClass.length - 3 === candidateClass.lastIndexOf('Col'); // ~endsWith
                        };
                    } else if (col.is('[class^=col]')) {
                        matchColClassFn = function(candidateClass) {
                            return 0 === candidateClass.indexOf('col'); // ~startsWith
                        };
                    }
                    if (matchColClassFn) {
                        var colClass;
                        var colClasses = col.attr('class').split(' ');
                        for (var i in colClasses) {
                            if ( colClasses[i] !== markClassName && matchColClassFn(colClasses[i])) {
                                colClass = colClasses[i];
                                break;
                            }
                        }
                        if (colClass) {
                            colSel = tblSel + ' tr .' + colClass;
                            colGroupSel = colSel.replace(' tr ', ' colgroup ');
                            if (SET_ID_LATER === colId) {
                                if ($('#'+colClass).length > 0) { // not unique
                                    var otherSame = $('#'+colId);
                                    if (otherSame.hasClass(colId) && otherSame.closest('tr') === col.closest('tr')) {
                                         // same class in same tr, to hide as one group

                                        return; // go to next column
                                    } // else => create new id
                                } else {
                                    colId = colClass;
                                    col.attr('id', colId);
                                }
                            }
                            tblColgroup.children('col').eq(colNo).addClass(colClass);
                        }
                        if (SET_ID_LATER === colId) {
                            colId = 'colSelHidableColumn_t' + tbl.attr('id') + '_c' + i;
                            col.attr('id', colId); // set auto column id
                        }
                    }
                    if (settings[colId]) {
                        console.error('Config error: column with id "'+colId+'" is already configured');
                        return; // go to next column
                    }

                    var cSettings = setSettings[colId] || {};
                    cSettings.colId = colId;
                    cSettings.colNo = i + 1;
                    if (!colSel) {
                        colSel = tblSel + ' tr td:nth-child(' + cSettings.colNo+ ')';
                        colGroupSel = colSel.replace(' tr ', ' colgroup ').replace(' td:', ' col:');
                        colSel += ', ' + colSel.replace(' td:', ' th:');
                    }
                    columnStyle.insertRule(colSel+' {}', columnStyle.cssRules.length);
                    cSettings.ruleNo = columnStyle.cssRules.length - 1;
                    columnStyle.insertRule(colGroupSel + ' {}', columnStyle.cssRules.length);
                    settings[colId] = cSettings;
                }
                colNo += cellColspan;
            });
            tableSettings[id] = settings;
            cs.updateCols(tbl, settings);
        });
    };

    cs.updateColumnView = function (colId, hide) {
        var col = $('#'+colId);
        if (0 === col.length) {
            console.error('column with id #'+colId+' not found');

            return;
        }
        var table = col.closest('table');
        var id = table.find('.colsSelector').attr('id') || '';
        var settings = cs.getHidableSettings(id);
        cs.updateOneCol(colId, hide);
        settings[colId].hidden = hide;
        cs.saveHidableSettings(id, settings);
    };


    cs.getHidableSettings = function (id) {
        return tableSettings[id];
    };

    cs.getButtonForId = function (id) {
        var btnSel = '.colsSelector';
        if (id) {
            return $(document.getElementById(id)).filter(btnSel);
        }
        return $(btnSel);
    };

    cs.saveHidableSettings = function (id, settings) {
        var sendUrl = cs.selectorSendUrl;
        if (!sendUrl) {
            console.error('cubetools.columnselector.selectorSendUrl is not set');
            return null;
        }
        if (Array.isArray(settings)) {
            if (!settings.length) {
                var saveSettings = {};
            } else if (settings[0].name && settings[0].value) {
                var saveSettings = {};
                for (var i in settings) {
                    saveSettings[settings[i].name] = settings[i].value;
                }
            }
        } else {
            var saveSettings = {};
            for (var i in settings) {
                var toSave = $.extend({}, settings[i]);
                delete toSave.colId;
                delete toSave.colNo;
                delete toSave.ruleNo;
                saveSettings[i] = toSave;
            }
        }

        $.ajax({
            method: 'PUT',
            url: sendUrl,
            data: {id: id, fullPath: window.location.pathname, settings: saveSettings},
            dataType: 'json', // response data type
            success: submittedSuccessful,
            error: submittedUnsuccessful,
            _colSelId: id
        });

        return false;
    };

    var submittedSuccessful = function (content /*,jqXHR*/)
    {
        var btn = cs.getButtonForId(this._colSelId);
        var evt = $.Event('cubetools.colselector.column_settings_saved_passed');
        btn.trigger(evt, [content]); // id can be read from event.target.id
    };

    var submittedUnsuccessful = function (jqXHR, textStatus, errorThrown) {
        var btn = cs.getButtonForId(this._colSelId);
        var evt = $.Event('cubetools.colselector.column_settings_saved_failed');
        btn.trigger(evt, [textStatus, errorThrown]); // for id, see above
    };

    var bootstrap = {};

    bootstrap.getContentColumnPopover = function (btn) {
        var id = btn.attr('id') || '';
        var hidableCols = cs.getHidableSettings(id);
        var htmlContent = btn.data('colSelContent');
        if (!htmlContent) {
            var content = $('#popoverContentTemplate').clone().attr('id', null);
            content.find('input[name=id]').val(id);
            var formFieldsTemplate = content.find(".columnSelection").eq(0);
            var fieldParent = formFieldsTemplate.parent();
            for(var colId in hidableCols) {
                var columnFields = formFieldsTemplate.clone().show();
                var colData = hidableCols[colId];
                var inpId = 'inp'+id+'_'+colId;
                var colLabel = $('#'+colId).text() || '???';
                columnFields.find('label').attr('for', inpId).children(':not(:input)').eq(0).text(colLabel);
                columnFields.find('input').attr('name', colId).attr('id', inpId).attr('checked', !colData.hidden);
                fieldParent.append(columnFields);
            }
            formFieldsTemplate.remove();
            var html = content.html();
            btn.data('colSelContent', html);
        } else {
            var content = $('<div>').append(htmlContent); // <div> because html() returns inner html
            var columnFields = content.find(".columnSelection");
            for(var colId in hidableCols) {
                var colData = hidableCols[colId];
                columnFields.find('input[name='+colId+']').attr('checked', !colData.hidden);
            }
            var html = content.html();
        }

        return html;
    };

    bootstrap.closePopover = function (/* event */) {
        var id = $(this).closest('form').find('input[name=id]').val();
        var btn = cs.getButtonForId(id);
        btn.popover('hide');
        btn.data('bs.popover').inState.click = false; // twbs/bootstrap#16732

        return false;
    };

    bootstrap.updateColumnHidden = function (/* event */) {
        var inp = $(this);
        cs.updateColumnView(inp.attr('name'), !inp.prop('checked'));
    };

    cs.initializeBootstrapPopover = function (title, closeBtnSelector, checkboxSelector, rootSelector) {
        if ('undefined' === typeof(closeBtnSelector)) {
            closeBtnSelector = '.colSelCloseBtn';
        }
        if ('undefined' === typeof(checkboxSelector)) {
            checkboxSelector = 'form.colSelForm .columnSelection input';
        }
        if ('undefined' === typeof(rootSelector)) {
            rootSelector = document.body;
        }
        $('.colsSelector').popover({
            placement: 'right',
            html: true,
            title: '<button type="button" class="close colSelCloseBtn" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+title,
            content: function() {
                return bootstrap.getContentColumnPopover($(this));
            }
        });
        $(rootSelector).on('click', closeBtnSelector, bootstrap.closePopover);
        $(rootSelector).on('change', checkboxSelector, bootstrap.updateColumnHidden);
    };
})();
