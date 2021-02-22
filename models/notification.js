const mongoose = require('mongoose');
const BabyBottle = require('../models/baby-bottle');
const Diaper = require('../models/diaper');
const Doctor = require('../models/doctor');
const Vaccine = require('../models/vaccine');
const Baby = require('../models/bebe');

const NotificationSchema = mongoose.Schema({
  type: {type: String, required: true},
  date: {type: Date, required: true},
  read: {type: Boolean},
  baby: {type: mongoose.Schema.Types.ObjectId, ref: 'Bebe'}
});

const Notification = mongoose.model('Notifications', NotificationSchema);

const findNewNotification = (io, id) => {

  Baby.find({parent: id}, (err, result ) => {
    findBabyBottleNotification(io, result);
    findDiaperNotification(io, result);
    findDoctorNotification(io, result);
    findVaccineNotification(io, result);
  });
}

const findBabyBottleNotification = (io, babies) => {
  const ids = babies.map(b => b._id);
  console.log(ids);
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 1);
  BabyBottle.find({baby: ids}, (err, result) => {
    if (err) {}
    result.forEach(babyBottle => {
      babyBottle.tokenBabyBottle
        .filter(tokenDate => tokenDate.tokenDate <= currentDate)
        .forEach(tokenDate => {
          new Notification({
            type: 'babyBottle',
            date: tokenDate.tokenDate,
            read: false,
            baby: babyBottle.baby
          }).save().then((result) => {
            io.sockets.emit('notification', result);
          });
          console.log('find new notification', new Date());
        });
    });
  });
}

const findDiaperNotification = (io, babies) => {
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 3);
  Diaper.find({}, (err, result) => {
    if (err) {}
    result.forEach(diaper => {
      diaper.usedDiaper
      .filter(ud => ud.usedDate <= currentDate)
      .forEach(ud => {
        new Notification({
          type: 'diaper',
          date: ud.usedDate,
          read: false,
          baby: diaper.baby
        }).save();
        console.log('find   notification', new Date());
      });
    });
  });
}

const findDoctorNotification = (io, babies) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 3);
  Doctor.find({}, (err, result) => {
    if (err) {}
    result.forEach(doctor => {
      doctor.appointments
      .filter(ud => ud.appointment <= currentDate)
      .forEach(ud => {
        new Notification({
          type: 'doctor',
          date: ud.appointment,
          read: false,
          baby: doctor.baby
        }).save();
        console.log('find   notification', new Date());
      });
    });
  });
}

const findVaccineNotification = (io, babies) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 3);
  Vaccine.find({}, (err, result) => {
    if (err) {}
    result.forEach(vaccine => {
      vaccine.vaccineDates
      .filter(ud => ud.vaccineDate <= currentDate)
      .forEach(ud => {
        new Notification({
          type: 'vaccine',
          date: ud.vaccineDate,
          read: false,
          baby: vaccine.baby
        }).save();
        console.log('find   notification', new Date());
      });
    });
  });
}

module.exports = {findNewNotification, Notification};

