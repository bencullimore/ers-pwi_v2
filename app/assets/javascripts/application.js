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

  // Edit the patients data
  // edit the HTML as it should be done - Not happy about doing it this way, but heyho.
  // Phone - Home
  if ( $( ".checkdetailsbox" ).length ) {
    var phone_home_edit = $('.checkdetailsbox > div:eq(1) > div:eq(0) p').html().split('&nbsp;');
    var phone_home = phone_home_edit[0].split(' ');
    localStorage.setItem('phone_home', phone_home[1]+' '+phone_home[2]); // Set localStorage
    $('.checkdetailsbox > div:eq(1) > div:eq(0) p').html(phone_home[0]+' <span id="phone_home">'+localStorage.getItem('phone_home')+'</span>&nbsp;&nbsp;'+phone_home_edit[3]);
    // Phone - Mobile
    var phone_mobile_edit = $('.checkdetailsbox > div:eq(1) > div:eq(1) p').html().split('&nbsp;');
    var phone_mobile = phone_mobile_edit[0].split(' ');
    localStorage.setItem('phone_mobile', phone_mobile[1]+' '+phone_mobile[2]); // Set localStorage
    $('.checkdetailsbox > div:eq(1) > div:eq(1) p').html(phone_mobile[0]+' <span id="phone_mobile">'+localStorage.getItem('phone_mobile')+'</span>&nbsp;&nbsp;'+phone_mobile_edit[3]);
    // Email
    var email = $('.checkdetailsbox > div:eq(2) > div:eq(0) p').html().split('&nbsp;');
    localStorage.setItem('email', email[0]); // Set localStorage
    $('.checkdetailsbox > div:eq(2) > div:eq(0) p').html('<span id="email">'+localStorage.getItem('email')+'</span>&nbsp;&nbsp;'+email[3]);
  }
  // Modal
  // Phone - Mobile
  $('input#telhome').val(localStorage.getItem('phone_home'));
  $('#telhome .button').click(function(){
    localStorage.setItem('phone_home',$('input#telhome').val());
    $('.checkdetailsbox > div:eq(1) > div:eq(0) p #phone_home').text(localStorage.getItem('phone_home'));
  })
  // Phone - Mobile
  $('input#telmob').val(localStorage.getItem('phone_mobile'));
  $('#telmob .button').click(function(){
    localStorage.setItem('phone_mobile',$('input#telmob').val());
    $('.checkdetailsbox > div:eq(1) > div:eq(1) p #phone_mobile').text(localStorage.getItem('phone_mobile'));
  })
  // email
  $('input#email').val(localStorage.getItem('email'));
  $('#useremail .button').click(function(){
    localStorage.setItem('email',$('input#email').val());
    $('.checkdetailsbox > div:eq(2) > div:eq(0) p #email').text(localStorage.getItem('email'));
  })
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
