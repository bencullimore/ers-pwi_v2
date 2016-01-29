// Makes :contains case insesative
jQuery.expr[':'].contains = function(a, i, m) {
  return jQuery(a).text().toUpperCase()
    .indexOf(m[3].toUpperCase()) >= 0;
};

$(document).ready(function() {
  GOVUK.toggle.init();
  checkDetailsEditing();
  setUpFilters();
  setUpResetFilters();
  setUpSort();

  // Uses radio buttons to emulate a more usable select box
  $(".js-form-select label").click(function() {
    $(this).closest('.js-form-select').toggleClass("open");
  });

  // Apply filter button
  $('.cbp-spmenu-left p > a.button-book').on('click', function() {
    $('#showRightPush').trigger("click");
  });

  $('.checkdetailsbox > div:eq(5) > div a').click(function(e) {
    e.preventDefault();
    $(this).parent().parent().fadeOut('fast', function() {
      $(this).remove();
    });
  });
  // END: Edit the patients data

  // Accordion Arrow
  $('.acc-arrow').click(function() {
    $(this).hasClass('acc-arrow_blue') ?
      color = 'blue' :
      color = 'white';

    $(this).hasClass('down') ?
      $(this).css('background-image', 'url(/public/images/acc-arrow-down-' + color + '.png)').removeClass('down') :
      $(this).css('background-image', 'url(/public/images/acc-arrow-up-' + color + '.png)').addClass('down');
  });
  // END: Accordion Arrow
});

jQuery(document).ready(function($) {
  $(".clickable-row").click(function() {
    window.document.location = $(this).data("href");
  });
});

function goBack() {
  window.history.back();
}

function checkDetailsEditing() {
  // Get the value from the sessionStorage otherwise use the default inpage value
  var mobId = '#phone_mobile',
    homeId = '#phone_home',
    emailId = '#email',
    phone_mobile = sessionStorage.phone_mobile || $(mobId).text(),
    phone_home = sessionStorage.phone_home || $(homeId).text(),
    email = sessionStorage.email || $(emailId).text();

  // Set the values
  if (phone_mobile) {
    $(mobId).text(phone_mobile);
    $(mobId + '_edit').val(phone_mobile);
  }
  if (phone_home) {
    $(homeId).text(phone_home);
    $(homeId + '_edit').val(phone_home);
  }
  if (email) {
    $(emailId).text(email);
    $(emailId + '_edit').val(email);
  }

  // set up listeners on the edit buttons
  $('.edit').on('click', function(e) {
    // save the 'new' value into sessionStorage and update the fields on the page
    var input = $($(this).parent().siblings()[1]).find('input'),
      id = input.attr('id'),
      val = input.val(),
      idForStorage = id.substring(0, id.lastIndexOf('_'));

    sessionStorage[idForStorage] = val;
    $('#' + idForStorage).text(val);
  });
}

function filter(event) {
  console.log('Filtering...');
  var $currentInput = $(event.currentTarget).first('input'),
  parentFilterClass = $(event.delegateTarget).parents('dd').first().attr('class'),
      splitLocation = parentFilterClass.indexOf('-') + 1,
             filter = parentFilterClass.substring(splitLocation),
         filterType = $currentInput.attr('type'),
            checked = $currentInput.attr('checked'),
     filtersToApply = [];

  if (checked) {
    $currentInput.removeAttr('checked');
  } else {
    $currentInput.attr('checked', 'checked');
  }

  // Get all of the filters that are checked and dig out the values
  $('.' + parentFilterClass).find('input:checked').each(function() {
    var val = $(this).attr('data-filter-val').toLowerCase();
    filtersToApply.push(val);
  });

  // Hide all of the rows that haven't met the criteria
  // TODO: Ensure this different filters work together
  $('.filterable').each(function() {
    var clinicCriteria,
        showClinic = false;

    if (filtersToApply.length === 0 || filtersToApply.indexOf('any') !== -1) {
      // Nothing to filter by or any selected - show everything
      showClinic = true;
    } else {
      clinicCriteria = $(this).attr('data-filter-' + filter).split(',');

      // if radio button
      if (filterType === 'radio') {
        clinicCriteria.forEach(function(criteria) {
          if (parseInt(criteria) <= parseInt(filtersToApply[0])) {
            showClinic = true;
          }
        });
      } else {
        // TODO: need to know if the filter is inclusive or exclusive!
        // Currently it is an OR

        // if the list of filters to apply doesn't have what the clinic does - hide it
        clinicCriteria.forEach(function(criteria) {
          if (filtersToApply.indexOf(criteria) !== -1) {
            console.log('At least one of the appointments is for the day(s) selected.');
            console.log('Show the clinic.');
            showClinic = true;
            // the loop can be exited now, the clinic is going to be shown
          }
        });
      }
    }

    showClinic ? $(this).show() : $(this).hide();
  });
}

function setUpFilters() {
  console.log('setUpFilters...');
  $('[class*=filter-] div.form-group input').on('click', filter);
}

function resetFilters() {
  $('[class*=filter-] div.form-group input').removeAttr('checked');
  $('.filterable').show();
}

function setUpResetFilters() {
  $('.reset-filters').on('click', resetFilters);
}

function sort() {
  var sortCriteria = $(this).data('sort-val'),
  sorted = $('.clinicresult').sort(function(a, b) {
    return $(a).data('filter-' + sortCriteria) - $(b).data('filter-' + sortCriteria);
  });
  $('.clinicresult').remove();
  $('.sortable').append(sorted);
}

function setUpSort() {
  $('.sort input').on('click', sort);
}
