$(document).ready(function(){

  GOVUK.toggle.init();

  // Initialise auto-suggest fields
  //$('.auto-suggest').selectToAutocomplete();


  // Uses radio buttons to emulate a more usable select box
  $( ".js-form-select label" ).click(function() {
  	$( this ).closest('.js-form-select').toggleClass( "open" );
  });

  // Postcode lookup
  // Hide address list if user changes postcode
	var lastValue = '';
	$("#postcode").on('change keyup paste mouseup', function() {
	    if ($(this).val() != lastValue) {
	        lastValue = $(this).val();
  			$( "#address-list" ).addClass("js-hidden");
  			$( "#submit-postcode" ).removeClass("js-hidden");
	    }
	});

  // Filter Appointment

  // Make Reset Filters button active
  $('dl.accordion dd input[type="checkbox"]').change(function(){
    $('dl.accordion dd input[type="checkbox"]').not(':checked').length > 0 ?
      $('.cbp-spmenu-right .span6 .close').removeClass('close').addClass('reset-filters') :
      $('.cbp-spmenu-right .span6 .reset-filters').removeClass('reset-filters').addClass('close');
  });

  // Reset filter button
  $('.cbp-spmenu-right p > a.button-cancel').on('click', function(){
    $('dl.accordion dd input[type="checkbox"]').not(':checked').trigger("click");
  });

  // Apply filter button
  $('.cbp-spmenu-right p > a.button-book').on('click', function(){
    $('#showRightPush').trigger("click");
  });


  // Clinic Day
  $('dl.accordion dd:eq(0) input[type="checkbox"]').change(function(){
    var dayOfWeek = $(this).attr('id');
    this.checked ?
      $('.main table tr td p:contains('+dayOfWeek+')').parents('tr').removeClass('day-hide').not('.time-hide').show() :
      $('.main table tr td p:contains('+dayOfWeek+')').parents('tr').addClass('day-hide').hide()

    $('.main table tr:visible:odd, .main table tr:visible:odd td').css('background-color','transparent');
    $('.main table tr:visible:even, .main table tr:visible:even td').css('background-color','#eff3f5');
  });

  // Clinic Time
  $('dl.accordion dd:eq(1) div:eq(0) input[type="checkbox"]').change(function(){
    $('.main table tr:odd').not(':hidden').css('background-color','#f9f9f9');
    $('.main table tr:even').not(':hidden').css('background-color','transparent');
    var timeOfDay = $(this).attr('value');
    var afternoon = ['12','1','2','3'];
    var evening = ['4','5','6','7','8'];
    var thisCheckbox = $(this);

    if (timeOfDay == 1) { // Morning (All AM)
      this.checked ?
        $('.main table tr td p:contains("am")').parents('tr').removeClass('time-hide').not('.day-hide').show() :
        $('.main table tr td p:contains("am")').parents('tr').addClass('time-hide').hide();
    }
    else {
      $('.main table tr td:nth-child(2) p').each(function(){
        var hour = $(this).text().split('.');
        var thisPara = $(this);

        if (timeOfDay == 2){ // Afternoon (12-3)
          if ($.inArray(hour[0],afternoon) > -1){
            $(thisCheckbox).is(':checked')?
              $(thisPara).parents('tr').removeClass('time-hide').not('.day-hide').show():
              $(thisPara).parents('tr').addClass('time-hide').hide();
          }
        }
        else { // Evening (4-8)
          if ($.inArray(hour[0],evening) > -1){
            $(thisCheckbox).is(':checked')?
              $(thisPara).parents('tr').not('.day-hide').removeClass('time-hide').show():
              $(thisPara).parents('tr').addClass('time-hide').hide();
          }
        }
      });
    }
    $('.main table tr:visible:odd, .main table tr:visible:odd td').css('background-color','transparent');
    $('.main table tr:visible:even, .main table tr:visible:even td').css('background-color','#eff3f5');
  });
  // END: Filter Appointment

  // load the page, check the session storage. if it isn't there, get it from the page and load it into the storage

  // Get the value from the sessionStorage otherwise use the default inpage value
  var phone_mobile = sessionStorage['phone_mobile'] || $('#phone_mobile').text(),
        phone_home = sessionStorage['phone_home'] || $('#phone_home').text(),
             email = sessionStorage['email'] || $('#email').text();

  // Set the values
  if (phone_mobile) {
    $('#phone_mobile').text(phone_mobile);
    $('#phone_mobile_edit').val(phone_mobile);
  }
  if (phone_home) {
    $('#phone_home').text(phone_home);
    $('#phone_home_edit').val(phone_home);
  }
  if (email) {
    $('#email').text(email);
    $('#email_edit').val(email);
  }

  // set up listeners on the edit buttons
  $('.edit').on('click', function(e) {
    console.log('hi there');
    // save the 'new' value into sessionStorage and update the fields on the page
    var input = $($(this).parent().siblings()[1]).find('input'),
           id = input.attr('id'),
          val = input.val(),
          idForStorage = id.substring(0, id.lastIndexOf('_'));

    sessionStorage[idForStorage] = val;
    $('#' + idForStorage).text(val);
  });

  $('.checkdetailsbox > div:eq(5) > div a').click(function(e){
    e.preventDefault();
    $(this).parent().parent().fadeOut('fast',function(){
      $(this).remove();
    })
  })
  // END: Edit the patients data
});

jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
        window.document.location = $(this).data("href");
    });
});

function goBack() {
    window.history.back()
}
