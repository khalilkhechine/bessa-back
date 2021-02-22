const mongoose = require('mongoose');
const BabyBottle = require('../models/baby-bottle');
const Diaper = require('../models/diaper');
const Doctor = require('../models/doctor');
const Vaccine = require('../models/vaccine');
const Baby = require('../models/bebe');

const NotificationSchema = mongoose.Schema({
  type: {type: String, required: true},
  date: {type: Date, required: true},
  referenceId: {type: mongoose.Schema.Types.ObjectId},
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

const findOldNotification = (io, id) => {
  Baby.find({parent: id}, (err, babies ) => {
    const ids = babies.map(b => b._id);
    Notification.find({baby: ids, read: false, date: {$gte: new Date()}}, (err, result) => {
      if (err) {
      }
      result.forEach(n => {
        io.sockets.emit('notification', n);
      })
    });
  });
}

const findBabyBottleNotification = (io, babies) => {
  const ids = babies.map(b => b._id);
  const maxDate = new Date();
  maxDate.setHours(maxDate.getHours() + 1);
  BabyBottle.find({baby: ids}, (err, result) => {
    if (err) {}
    result.forEach(babyBottle => {
      babyBottle.tokenBabyBottle
        .filter(tokenDate => tokenDate.tokenDate <= maxDate)
        .forEach(tokenDate => {
          saveAndSendNotification(tokenDate._id, io, 'babyBottle', tokenDate.tokenDate, babyBottle.baby)
        });
    });
  });
}

const findDiaperNotification = (io, babies) => {
  const maxDate = new Date();
  const currentDate = new Date();
  const ids = babies.map(b => b._id);
  maxDate.setHours(maxDate.getHours() + 3);
  Diaper.find({baby: ids}, (err, result) => {
    if (err) {}
    result.forEach(diaper => {
      diaper.usedDiaper
      .filter(ud => ud.usedDate <= maxDate && ud.usedDate > currentDate)
      .forEach(ud => {
        saveAndSendNotification(ud._id, io, 'diaper', ud.usedDate, diaper.baby)
      });
    });
  });
}

const findDoctorNotification = (io, babies) => {
  const ids = babies.map(b => b._id);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);
  Doctor.find({baby: ids}, (err, result) => {
    if (err) {}
    result.forEach(doctor => {
      doctor.appointments
      .filter(ud => ud.appointment <= maxDate)
      .forEach(ud => {
        saveAndSendNotification(ud._id, io, 'doctor', ud.appointment, doctor.baby)
      });
    });
  });
}

const findVaccineNotification = (io, babies) => {
  const ids = babies.map(b => b._id);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 3);
  Vaccine.find({baby: ids}, (err, result) => {
    if (err) {}
    result.forEach(vaccine => {
      vaccine.vaccineDates
      .filter(ud => ud.vaccineDate <= maxDate)
      .forEach(ud => {
        saveAndSendNotification(ud._id, io, 'vaccine', ud.vaccineDate, vaccine.baby)
      });
    });
  });
}

const saveAndSendNotification = (referenceId, io, type, date, babyId) => {
  Notification.countDocuments({referenceId: referenceId},  (err, count) => {
    if(count === 0) {
      console.log('new notification' + type +  ' : ' + new Date());
      new Notification({
        type: type,
        date: date,
        read: false,
        referenceId: referenceId,
        baby: babyId
      }).save().then((result) => {
        io.sockets.emit('notification', result);
      });
    }
  });
}

const setRead = (notifications) => {
  const ids = notifications.map(e => e._id);
  Notification.updateMany({_id: ids}, {$set: {read: true}}).exec()
}

module.exports = {findNewNotification, findOldNotification, setRead, Notification};

