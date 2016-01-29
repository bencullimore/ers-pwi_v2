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

function setUpFilters() {
  console.log('setUpFilters...');
  $('[class*=filter-] div.form-group input').on('click', buildFilterMap);
}

function resetFilters() {
  $('[class*=filter-] div.form-group input').removeAttr('checked');
  $('.filterable').show();
}

function setUpResetFilters() {
  $('.reset-filters').on('click', resetFilters);
}

function setUpSort() {
  $('.sort input').on('click', sort);
}

function sort() {
  var sortCriteria = $(this).data('sort-val'),
    sorted = $('.clinicresult').sort(function(a, b) {
      return $(a).data('filter-' + sortCriteria) - $(b).data('filter-' + sortCriteria);
    });
  $('.clinicresult').remove();
  $('.sortable').append(sorted);
}
// Filtering
// get all of the filters that have been applied
// create a map, keyed on the filter
function buildFilterMap(event) {
  var $currentInput = $(event.currentTarget).first('input'),
            checked = $currentInput.attr('checked'),
         allFilters = $('[class*=filter-]'),
          filterMap = {};

  if (checked) {
    $currentInput.removeAttr('checked');
  } else {
    $currentInput.attr('checked', 'checked');
  }

  // for all filters, get what has been set
  allFilters.each(function(idx, filter) {
    // trim the class up to get the actual filter key
    var filterName = $(filter).attr('class').replace('-', ''),
              vals = [];

    $(filter).find('input:checked').each(function(_, f) {
      var val = $(this).attr('data-filter-val');
      vals.push(val);
    });

    filterMap[filterName] = vals;
  });
  doTheFilter(filterMap);
}

// based on the set of filters, hide or show the results
function doTheFilter(filterMap) {
  $('.filterable').each(function() {
    var resultData = $(this).data(),
      showClinic = true,
      filters,
      filterKey;

    for (filterKey in filterMap) {
      filters = filterMap[filterKey];
      if (filters.length > 0) {

        if (filterKey === 'filterAccessibility' ||
            filterKey === 'filterParking' ||
            filterKey === 'filterFacilities') {
          filters.forEach(function(fil) {
            if (resultData[filterKey].indexOf(fil) === -1) {
              showClinic = false;
            }
          });
        } else {
          // check if the result has the correct criteria
          resultData[filterKey].forEach(function(criteria) {
            // check if the any option is set, if it is, no need to check any further
            // and only need to check if there are some filters set
            if (filters.indexOf('any') === -1 && filters.length > 0) {
              // if the applied filters do not have what the clinic has, hide the result
              if (filterKey === 'filterWaitingTime' || filterKey === 'filterDistanceBucket') {
                // assume this is going to be a single value as it a clinic property
                if (parseInt(filters[0]) < parseInt(criteria)) {
                  showClinic = false;
                }
              } else {
                // this works for single value things like the time
                if (typeof(criteria) === 'number') {
                  criteria = criteria.toString();
                }
                if (filters.indexOf(criteria) === -1) {
                  console.log('Hide the clinic.');
                  showClinic = false;
                }
              }
            }
          });
        }
      }
    }

    showClinic ? $(this).show() : $(this).hide();
  });
}
