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

  // Uses radio buttons to emulate a more usable select box
  $(".js-form-select label").click(function() {
    $(this).closest('.js-form-select').toggleClass("open");
  });

  // Filter Appointment

  // Make Reset Filters button active
  // $('dl.accordion dd input[type="checkbox"]').not('#anyday').change(function() {
  //   $('dl.accordion dd input[type="checkbox"]').not(':checked').length > 0 ?
  //     $('.cbp-spmenu-left .span6 .close').removeClass('close').addClass('reset-filters') :
  //     $('.cbp-spmenu-left .span6 .reset-filters').removeClass('reset-filters').addClass('close');
  // });

  // Reset filter button
  // $('.cbp-spmenu-left p > a.button-cancel').on('click', function() {
  //   $('dl.accordion dd:eq(1) input#anyday').trigger("click");
  // });

  // Apply filter button
  $('.cbp-spmenu-left p > a.button-book').on('click', function() {
    $('#showRightPush').trigger("click");
  });


  //
  // // Clinic Day
  // $('dl.accordion dd:eq(1) input[type="checkbox"]').change(function() {
  //   var dayOfWeek = $(this).attr('id');
  //   if (dayOfWeek == 'anyday') {
  //     if ($(this).is(':checked')) {
  //       $('dl.accordion dd:eq(1) input').not('#anyday').removeAttr("checked");
  //       $('.main table tr').show().removeClass('day-hide');
  //       $('.cbp-spmenu-left .span6 .reset-filters').removeClass('reset-filters').addClass('close');
  //     } else {
  //       $('.main table tr').hide();
  //       $('.cbp-spmenu-left .span6 .close').removeClass('close').addClass('reset-filters');
  //     }
  //   } else {
  //     $('dl.accordion dd:eq(1) input#anyday').removeAttr("checked");
  //     //$('.main table tr').not('.day-hide').hide();
  //     this.checked ?
  //       $('.main table tr td p:contains(' + dayOfWeek + ')').parents('tr').addClass('day-hide').show() :
  //       $('.main table tr td p:contains(' + dayOfWeek + ')').parents('tr').removeClass('day-hide').not('.time-hide');
  //
  //     $('.main table tr').not('.day-hide').hide();
  //   }
  //
  //   //$('.main table tr').not('.day-hide').hide();
  //   $('.main table tr:visible:odd, .main table tr:visible:odd td').css('background-color', 'transparent');
  //   $('.main table tr:visible:even, .main table tr:visible:even td').css('background-color', '#eff3f5');
  // });
  //
  // // Clinic Time
  // $('dl.accordion dd:eq(2) div:eq(0) input[type="checkbox"]').change(function() {
  //   $('.main table tr:odd').not(':hidden').css('background-color', '#f9f9f9');
  //   $('.main table tr:even').not(':hidden').css('background-color', 'transparent');
  //   var timeOfDay = $(this).attr('id');
  //   var afternoon = ['12', '1', '2', '3'];
  //   var evening = ['4', '5', '6', '7', '8'];
  //   var thisCheckbox = $(this);
  //
  //   if (timeOfDay == 'morning') { // Morning (All AM)
  //     console.log('am');
  //     this.checked ?
  //       $('.main table tr td p:contains("am")').parents('tr').removeClass('time-hide').not('.day-hide').show() :
  //       $('.main table tr td p:contains("am")').parents('tr').addClass('time-hide').hide();
  //   } else {
  //     $('.main table tr td:nth-child(2) p').each(function() {
  //       var hour = $(this).text().split('.');
  //       var thisPara = $(this);
  //
  //       if (timeOfDay == 'aft') { // Afternoon (12-3)
  //         if ($.inArray(hour[0], afternoon) > -1) {
  //           $(thisCheckbox).is(':checked') ?
  //             $(thisPara).parents('tr').removeClass('time-hide').not('.day-hide').show() :
  //             $(thisPara).parents('tr').addClass('time-hide').hide();
  //         }
  //       } else { // Evening (4-8)
  //         if ($.inArray(hour[0], evening) > -1) {
  //           $(thisCheckbox).is(':checked') ?
  //             $(thisPara).parents('tr').not('.day-hide').removeClass('time-hide').show() :
  //             $(thisPara).parents('tr').addClass('time-hide').hide();
  //         }
  //       }
  //     });
  //   }
  //   $('.main table tr:visible:odd, .main table tr:visible:odd td').css('background-color', 'transparent');
  //   $('.main table tr:visible:even, .main table tr:visible:even td').css('background-color', '#eff3f5');
  // });
  // END: Filter Appointment

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

  // Sort Clinics
  $('.sort input').click(function() {
    index = $(this).parents('.form-item-wrapper').index();
    $('.clinicresult').sort(function(a, b) {
      return $(a).data('sort')[index] - $(b).data('sort')[index];
    }).each(function(_, container) {
      $(container).parent().append(container);
    });
  });
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
  $('.clinicresult').each(function() {
    var showClinic = false;

    if (filtersToApply.length === 0 || filtersToApply.indexOf('any') !== -1) {
      // Nothing to filter by or any selected - show everything
      showClinic = true;
    } else {
      var clinicCriteria = $(this).attr('data-filter-' + filter).split(',');

      // if radio button
      if (filterType === 'radio') {
        if (clinicCriteria <= filtersToApply[0]) {
          showClinic = true;
        }
      } else {
        // TODO: need to know if the filter is inclusive or exclusive!
        // Assume it is an AND

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
  // Uncheck all filters and show all results
  $('[class*=filter-] div.form-group input').removeAttr('checked');
  $('.clinicresult').show();
}

function setUpResetFilters() {
  $('.reset-filters').on('click', resetFilters);
}
