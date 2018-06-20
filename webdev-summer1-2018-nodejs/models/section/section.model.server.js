var mongoose = require('mongoose');
var sectionSchema = require('./section.schema.server');
var sectionModel = mongoose.model('SectionModel', sectionSchema);
var enrollmentSchema = require('../enrollment/enrollment.schema.server');
var enrollmentModel = mongoose.model('EnrollmentModel', enrollmentSchema);
function createSection(section) {
  return sectionModel.create(section);
}

function findSectionsForCourse(courseId) {
  return sectionModel.find({courseId: courseId});
}

function decrementSectionSeats(sectionId) {
  return sectionModel.update({_id: sectionId}, {
    $inc: {seats: -1}
  });
}

function findSectionById(sectionId)
{
 // console.log("TRY HARD:"+sectionModel.find({_id:sectionId},{seats: 1, _id:0}).seats);
  return sectionModel.find({_id:sectionId},{seats: 1, _id:0}).seats;

}

function incrementSectionSeats(sectionId) {
  return sectionModel.update({_id: sectionId}, {
    $inc: {seats: 1}
  });
}

function deleteSection(sectionId){

  enrollmentModel.remove({section: sectionId}, function(err, result){
    if(err){
      console.log(err);
    }
    console.log(result);
  });

    return sectionModel.findByIdAndRemove(sectionId)
}

function updateSection(section) {
    return sectionModel.update({
        _id: section.id
    }, {
        $set: {name: section.newName, seats:section.newRem, maxSeats:section.newMax}
    });
}


module.exports = {
  createSection: createSection,
  findSectionsForCourse: findSectionsForCourse,
  decrementSectionSeats: decrementSectionSeats,
  incrementSectionSeats: incrementSectionSeats,
    findSectionById: findSectionById,
    deleteSection: deleteSection,
    updateSection:updateSection
};