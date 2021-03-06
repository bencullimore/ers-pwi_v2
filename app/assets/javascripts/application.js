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
  hideMenusWhenClickingAwayFromThem();

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
  $('.results').on('click', '.clickable-row', function() {
    window.document.location = $(this).data("href");
  });
});

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
  prepopulateFilters();
  $('[class*=filter-] div.form-group input').on('click', buildFilterMap);
}

function prepopulateFilters() {
  var filters,
      filterMap = loadTheFilters();

  for (var filterKey in filterMap) {
    filters = filterMap[filterKey];
    if (filters.length) {
      // find the filters and mark them all as checked
      var inputFilterSelector = '.filter-' + filterKey.slice(6);
      filters.forEach(function(fil) {
        $(inputFilterSelector + ' [data-filter-val="'+ fil +'"]').attr('checked', 'checked');
      });
    }
  }
  doTheFilter(filterMap);
}

function resetFilters() {
  sessionStorage['Filters'] = JSON.stringify({});
  $('[class*=filter-] div.form-group input').removeAttr('checked');
  $('.no-results').addClass('hidden');
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

// Create map, keyed on filter of all filters
function buildFilterMap(event) {
  var $currentInput = $(event.currentTarget).first('input'),
            checked = $currentInput.attr('checked'),
         allFilters = $('[class*=filter-]'),
          filterMap = loadTheFilters();

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
  saveTheFilters(filterMap);
  doTheFilter(filterMap);
}

function loadTheFilters() {
  var filters = sessionStorage['Filters'];
  return filters ?
         JSON.parse(filters) :
         {};
}

function saveTheFilters(filterMap) {
  sessionStorage['Filters'] = JSON.stringify(filterMap);
}

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
          if (resultData[filterKey]) {
            // if there are some filters applied that are not any do some filtering
            if (filters.indexOf('any') === -1 && filters.length > 0) {
              // if the filter is for appointment criteria
              if (filterKey === 'filterClinicSlot' || filterKey === 'filterClinicDay') {
                // if none of the filters are found, hide it
                showClinic = false;
                filters.forEach(function(fil) {
                  if (resultData[filterKey].includes(fil)) {
                    showClinic = true;
                  }
                });
              } else {
                resultData[filterKey].forEach(function(filterCriteria) {
                    if (filterKey === 'filterWaitingTime' || filterKey === 'filterDistanceBucket') {
                      // assume this is going to be a single value as it a clinic property
                      if (parseInt(filters[0]) < parseInt(filterCriteria)) {
                        showClinic = false;
                      }
                    } else {
                      // this works for single value things like the time
                      if (typeof(filterCriteria) === 'number') {
                        filterCriteria = filterCriteria.toString();
                      }
                      if (filters.indexOf(filterCriteria) === -1) {
                        console.log('Hide the clinic.');
                        showClinic = false;
                      }
                    }
                });
              }
            }
          }
        }
      }
    }

    showClinic ? $(this).show() : $(this).hide();
  });

  // no results displayed, turn on the no results message
  $('.filterable').is(':visible') ?
    $('.no-results').addClass('hidden') :
    $('.no-results').removeClass('hidden');
}

function hideMenusWhenClickingAwayFromThem() {
  $('.container').on('click', function(event) {
    if (event.target.id !== 'showLeft' && event.target.id !== 'showRight') {
      $('.cbp-spmenu-open').removeClass('cbp-spmenu-open');
    }
  });
}
