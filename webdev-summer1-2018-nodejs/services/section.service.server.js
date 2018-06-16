module.exports = function (app) {

  app.post('/api/course/:courseId/section', createSection);
  app.get('/api/course/:courseId/section', findSectionsForCourse);
  app.post('/api/section/:sectionId/enrollment', enrollStudentInSection);
  app.get('/api/student/section', findSectionsForStudent);
  app.get('/api/section/:sectionId/student', findStudentsForSection);

  var sectionModel = require('../models/section/section.model.server');
  var enrollmentModel = require('../models/enrollment/enrollment.model.server');

  function findSectionsForCourse(req, res) {
    var courseId = req.params['courseId'];
    sectionModel
      .findSectionsForCourse(courseId)
      .then(function (sections) {
        res.json(sections);
      })
  }

  function createSection(req, res) {
    var section = req.body;
    sectionModel
      .createSection(section)
      .then(function (section) {
        res.json(section);
      })
  }

    function enrollStudentInSection(req, res) {
    console.log("In enrollment server"+req.params.sectionId);
        var sectionId = req.params.sectionId;
        var currentUser = req.session.currentUser;
        var studentId = currentUser._id;
        console.log("CURRENT USER:"+currentUser);
        console.log("STudnet id:"+studentId);
        var enrollment = {
            student: studentId,
            section: sectionId
        };

        sectionModel
            .decrementSectionSeats(sectionId)
            .then(function () {
                return enrollmentModel
                    .enrollStudentInSection(enrollment)
            })
            .then(function (enrollment) {
                res.json(enrollment);
            })
    }

  function findSectionsForStudent(req, res) {
        var currentUser = req.session.currentUser;
        var studentId = currentUser._id;
        enrollmentModel
            .findSectionsForStudent(studentId)
            .then(function(enrollments) {
                res.json(enrollments);
            });
    }


    function findStudentsForSection(req, res) {
    enrollmentModel
      .findStudentsForSection(req.params.sectionId)
      .then(function (enrollments) {
        res.json(enrollments);
      })
  }
};