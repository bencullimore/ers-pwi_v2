var querystring = require('querystring');

module.exports = {
  bind : function (app) {
    app.locals.gmap_key = 'AIzaSyAgqbgwoLuAoQQjpGbRyE3vLnFtIb7wZ9M';

    app.get('/', function (req, res) {
      res.render('index');
    });

    function getClinicById(clinic_id) {
      if (!parseInt(clinic_id)) {
        clinic_id = '1';
      }
      var clinic = app.locals.clinics.filter(function(item) {
        return item.id === clinic_id;
      })[0];
      return addDateToAppointments(clinic);
    }

    function getUserById(id) {
      return app.locals.users.filter(function(item) {
        return item.id === id;
      })[0];
    }

    app.get('/book-an-appointment/home-screen', function(req, res) {
      var referralViewModel,
          ref = req.query.reference;

      app.locals.referrals.forEach(function(referral) {
        if (referral.reference === ref) {
          referralViewModel = referral;
        }
      });

      if (!referralViewModel) {
        referralViewModel = app.locals.referrals[0];
      }

      res.render('book-an-appointment/home-screen',
      {
        referral: referralViewModel,
        user: getUserById(referralViewModel.user_id)
      });
    });

    app.get('/book-an-appointment/:service_slug?/check-details/:user_id', function(req, res) {
      res.render('book-an-appointment/check-details',
      {
        user: getUserById(req.params.user_id)
      });
    });

    app.get('/book-an-appointment/:service_slug?/select-your-clinic', function(req, res) {
      var service = req.params.service_slug.toLowerCase(),
          clinics = app.locals.clinics.filter(function(item) {
                      // Sort the appointments for each clinic and set the next one
                      var next_appointment = item.appointments.sort(function(a, b) {
                        var a_days = parseInt(a.days_in_future),
                            b_days = parseInt(b.days_in_future);
                        if (a_days > b_days) {
                          return 1;
                        }
                        if (a_days < b_days) {
                          return -1;
                        }
                        return 0;
                      })[0];
                      item.next_appointment = next_appointment;
                      return item.type.toLowerCase() === service;
                    })
                    // sort the clinics on the next available appointment
                    .sort(function(a, b) {
                      return parseInt(a.next_appointment.days_in_future) > parseInt(b.next_appointment.days_in_future);
                    });

      res.render('book-an-appointment/select-your-clinic',
      {
        clinics: clinics
      });
    });

    app.get('/book-an-appointment/:clinic_id/select-appointment', function(req, res) {
      var clinic = getClinicById(req.params.clinic_id);
      res.render('book-an-appointment/select-appointment',
      {
        clinic: clinic
      });
    });

    app.get('/book-an-appointment/:clinic_id/review-appointment/:appointment_id', function(req, res) {
      var appointment_id = req.params.appointment_id,
                  clinic = getClinicById(req.params.clinic_id);
             appointment = getAppointmentById(clinic, appointment_id);
      res.render('book-an-appointment/review-appointment',
      {
        clinic: clinic,
        appointment: appointment
      });
    });

    app.get('/book-an-appointment/:clinic_id/confirmation/:appointment_id', function(req, res) {
      var appointment_id = req.params.appointment_id,
                  clinic = getClinicById(req.params.clinic_id);
             appointment = getAppointmentById(clinic, appointment_id);
      res.render('book-an-appointment/confirmation',
        {
          clinic: clinic,
          appointment: appointment,
          gmap_key: app.locals.gmap_key
        });
    });

    app.get(/^\/(book-an-appointment\/[^.]+)$/, function (req, res) {
      var path = (req.params[0]);

      res.render(
        path,
        {
          practice: app.locals.gp_practices[0]
        },
        function(err, html) {
          if (err) {
            console.log(err);
            res.send(404);
          } else {
            res.end(html);
          }
        }
      );
    });
  }
};

function addDateToAppointments(clinic) {
  clinic.appointments.forEach(function(appointment) {
    addDateToAppointment(appointment);
  });
  return clinic;
}

function addDateToAppointment(appointment) {
  var millis_in_day = 86400000,
                now = Date.now();
               date = new Date(now + appointment.days_in_future * millis_in_day),
               time = appointment.time.split(':');

    date.setHours(time[0]);
    date.setMinutes(time[1]);
    appointment.date = date;
  return appointment;
}

function getAppointmentById(clinic, appointmentId) {
  return clinic.appointments.filter(function (appointment) {
    return appointment.id == appointmentId;
  })[0];
}
