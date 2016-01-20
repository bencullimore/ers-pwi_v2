var querystring = require('querystring');

module.exports = {
  bind : function (app) {
    function find_gp_practice(slug) {
      return app.locals.gp_practices.filter(
        function(p) {
          return p.slug === slug;
        }
      )[0];
    }

    function find_appointment(uuid) {
      return app.locals.appointments.filter(
        function(a) {
          return a.uuid === uuid;
        }
      )[0];
    }

    function find_matching_appointments(filter_functions) {
      return filter_functions.reduce(function(filtered_appointments, filter_func) {
        return filtered_appointments.filter(filter_func);
      }, app.locals.appointments);
    }

    function find_matching_appointment(filter_functions) {
      return find_matching_appointments(filter_functions)[0]
    }

    function getServiceFromSlug(service_slug_param) {
      var service_slug = service_slug_param || 'general-practice',
          service = app.locals.services.filter(function(service) {
            return service.slug === service_slug;
          })[0];

      return service;
    }

    function getPractitionerFromUuid(uuid) {
      return app.locals.practitioners.filter(function(practitioner) {
        return practitioner.uuid === uuid;
      })[0];
    };

    function findPractitionersForService(service_slug) {
      var service_to_uuid = {};

      app.locals.appointments.forEach(function(appointment) {
        if(!service_to_uuid.hasOwnProperty(appointment.service)) {
          service_to_uuid[appointment.service] = [];
        }

        if(-1 == service_to_uuid[appointment.service].indexOf(appointment.practitioner_uuid)) {
          service_to_uuid[appointment.service].push(appointment.practitioner_uuid);
        }
      });

      return service_to_uuid[service_slug].map(getPractitionerFromUuid);
    }

    app.get('/', function (req, res) {
      res.render('index');
    });

    app.get('/book-an-appointment/home-screen', function(req, res) {
      var referralViewModel,
          ref = req.query.reference;
      // get the referral based on the ref id otherwise choose the first one
      // for each ref, check the value of the key
      app.locals.referrals.forEach(function(referral) {
        if (referral.reference === ref) {
          referralViewModel = referral;
        }
      });

      if (!referralViewModel) {
        console.log('Using first referral as no reference has been supplied.');
        referralViewModel = app.locals.referrals[0];
      }

      res.render('book-an-appointment/home-screen',
      {
        referral: referralViewModel
      });
    });

    app.get('/book-an-appointment/:service_slug?/check-details', function(req, res) {
      res.render('book-an-appointment/check-details');
    });

    app.get('/book-an-appointment/:service_slug?/select-your-clinic', function(req, res) {
      var service = req.params.service_slug.toLowerCase(),
          clinics = app.locals.clinics.filter(function(item) {
                      return item.type.toLowerCase() === service;
                    });
      res.render('book-an-appointment/select-your-clinic',
      {
        clinics: clinics
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

var filterByService = function(service_slug) {
  return function(appointment) {
    return appointment.service === service_slug;
  }
}

var filterFaceToFace = function(appointment) {
  return appointment.appointment_type == 'face to face';
};

var filterFemaleGP = function(appointment) {
  return appointment.practitioner.gender == 'female' && appointment.practitioner.role == 'GP';
};

var filterBefore10 = function(appointment) {
  var hour = parseInt(appointment.appointment_time.split(':')[0], 10);
  return hour < 10;
};

var filterByPractitionerUuid = function(uuid) {
  return function(appointment) {
    return appointment.practitioner_uuid === uuid;
  }
}
