//= require_tree ./templates 

/*
 *  Модуль отвечает за работу с таблицей в админке
 *
 */

app.modules.adminTable = (function(self) {
  var _$rootEl, _$tableRow, _$declineForm;

  function _showForm($form, $row) {
    if ($row) {
      _$tableRow.find('.js-admin-table-cell').append($form);
      $row.after(_$tableRow); 
    } else { 
      _$rootEl.find('.js-above-admin-table').append($form); 
    } 
    $form.show().find('textarea, input').trigger('keyup'); 
  }

  function _createTableRow() {
    var colspan = _$rootEl.find('.js-admin-table th').length;
    _$tableRow = $(HandlebarsTemplates['table_row']());
    _$tableRow.find('.js-admin-table-cell').attr({colspan: colspan});
  }

  function _acceptGroup(ids) {
    $.ajax({
      url: _$rootEl.data('accept-url'),
      type: 'put', 
      data: {ids: ids.join(',')},
      success: function() {
        location.reload();
      }
    });
  }

  function _getCheckedArray(){
    return _$rootEl.find('.js-admin-table-checkbox:checked').map(function() { 
      return this.value; 
    }).get();
  }

  function _setIds($el, ids) {
    $el.find('#ids_').val(ids.join(',')); 
  }

  function _listener() {
    _$rootEl
      .find('.js-accept-link').on('ajax:success', function() {
        location.reload();
      }).end()
      .on('click', '.js-close-form', function() {
        $(this).closest('.js-admin-table-row').remove(); 
      })

      .find('.js-decline-link').click(function(event) {
        var $row = $(this).closest('.js-admin-table-row');
        _setIds(_$declineForm, [$row.find('.js-admin-table-checkbox').val()]);
        _showForm(_$declineForm, $row);
        event.preventDefault();
      }).end()
      .find('.js-accept-group-link').click(function(event) {
        var ids = _getCheckedArray();
        if (!ids.length) {
          alert(_$rootEl.data('error-nothing-checked'));
          return;
        }
        _acceptGroup(ids);
        event.preventDefault(); 
      }).end()
      .find('.js-decline-group-link').click(function(event) {
        var ids = _getCheckedArray();
        if (!ids.length) {
          alert(_$rootEl.data('error-nothing-checked'));
          return;
        }
        _setIds(_$declineForm, ids);
        _showForm(_$declineForm); 
        event.preventDefault();
      });

    _$declineForm.on('ajax:success', function() {
      location.reload();
    }); 
  }

  self.load = function() {
    _$rootEl = $('.js-admin-page'); 
    if (!_$rootEl.length) {
      return;
    }
    _$declineForm = _$rootEl.find('.js-decline-form');
    _createTableRow();
    _listener();
  };

  return self;
})(app.modules.adminTable || {});
