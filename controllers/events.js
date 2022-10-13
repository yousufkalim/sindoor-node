const Events = require('../models/Events');
const Pictures = require('../models/Pictures');
const Users = require('../models/Users');
const Wishlists = require('../models/Wishlists');
const fs = require('fs'); // to delete images
const { translate } = require('../utils/translate');
const moment = require('moment');

//* Create and event
exports.create = async (req, res) => {
  try {
    let userId = req.user._id;
    let user = await Users.findById(userId);
    if (!user) {
      return res.status(409).json({
        success: false,
        message: translate['Service Provider Cannot create event.']
      });
    }
    // Generate a random code
    let code = Math.random().toFixed(10).slice(-10);
    code = code.match(/.{1,3}/g);
    code = code.slice(0, -1).join('-') + code.slice(-1);

    // store fille path into array
    let images = [];
    if (req.files) {
      req.files.forEach(image => {
        images.push(image.path);
      });
    }

    // create event object
    let event = new Events(req.body);
    event.code = code;
    event.location = JSON.parse(req.body.location);
    event.start_date = JSON.parse(req.body.start_date);
    if (req.body.end_date !== 'undefined') {
      event.end_date = JSON.parse(req.body.end_date);
    }
    event.organizer = userId;
    event.photos = images;
    event.save();

    let userEvent = {
      event: event._id,
      role: 'Organizer'
    };

    // update events array in user data
    user.events.push(userEvent);
    user.save();

    res.json({
      success: true,
      message: translate['Event Created Successfully.'],
      event
    });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

//* Join an event
exports.joinEvent = async (req, res) => {
  try {
    let { code, members } = req.body;
    let userId = req.user._id;
    let user = await Users.findById(userId);
    if (!user) {
      return res.status(409).json({
        success: false,
        message: translate['Service Provider Cannot join event as Guest.']
      });
    }
    let event = await Events.findOne({ code });
    if (!event) {
      return res.status(409).json({
        success: false,
        message: translate['Event not found.']
      });
    }
    let alreadyMember = await Events.findOne({ code, 'guests.guest': userId });
    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message: translate['You are already a member of this event.']
      });
    }
    if (event.organizer == userId) {
      return res.status(409).json({
        success: false,
        message: translate['Organizer cannot join event as guest.']
      });
    }
    let guest = { guest: userId, members };
    event.guests.push(guest);
    event.save();

    let userEvent = {
      event: event._id,
      role: 'Guest'
    };

    // update events array in user data
    user.events.push(userEvent);
    user.save();

    res.json({
      success: true,
      message: translate['Event joined successfully.'],
      event
    });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

//* change guest role in event
exports.changeRole = async (req, res) => {
  try {
    let { userId, eventId } = req.params;
    let event = await Events.findOne(
      {
        _id: eventId,
        'guests.guest': userId
      },
      { 'guests.$': 1 }
    );

    //* Update role by getting previous role
    let role = 'Co-Organizer';
    if (event.guests[0].role === 'Co-Organizer') {
      role = 'Guest';
    }

    await Events.findOneAndUpdate(
      {
        _id: eventId,
        'guests.guest': userId
      },
      {
        $set: { 'guests.$.role': role }
      },
      { new: true }
    )
      .then(async resp => {
        await Users.findOneAndUpdate(
          {
            _id: userId,
            'events.event': eventId
          },
          {
            $set: { 'events.$.role': role }
          },
          { new: true }
        );
        res.json({
          success: true,
          message: translate['Guest Status Updated.'],
          event: resp
        });
      })
      .catch(err => {
        throw err;
      });

    // res.json({ event });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

//* get events
exports.updateGuestStatus = async (req, res) => {
  try {
    let { userId, eventId } = req.params;
    let { status } = req.body;
    console.log({ userId, eventId });

    await Events.findOneAndUpdate(
      {
        _id: eventId,
        'guests.guest': userId
      },
      {
        $set: { 'guests.$.status': 'accepted' }
      },
      { new: true }
    )
      .then(resp => {
        res.json({
          success: true,
          message: translate['Guest Status Updated.'],
          event: resp
        });
      })
      .catch(err => {
        throw err;
      });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

//* get few upcoming events
exports.getFewUpcomingEvents = async (req, res) => {
  try {
    let userId = req.user._id;
    let events = await Events.find({
      $and: [
        {
          $or: [{ organizer: userId }, { 'guests.guest': userId }]
        },
        {
          $or: [
            { 'end_date.date': { $gte: moment().format('L') } },
            { 'start_date.date': { $gte: moment().format('L') } }
          ]
        }
      ]
    })
      .sort({ 'start_date.date': 1 })
      .limit(10)
      .populate('guests.guest', 'first_name last_name photo');
    res.json({ success: true, events });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

//* get upcoming events
exports.getUpcomingEvents = async (req, res) => {
  try {
    let userId = req.user._id;
    let events = await Events.find({
      $and: [
        {
          $or: [{ organizer: userId }, { 'guests.guest': userId }]
        },
        {
          $or: [
            { 'end_date.date': { $gte: moment().format('L') } },
            { 'start_date.date': { $gte: moment().format('L') } }
          ]
        }
      ]
    })
      .sort({ 'start_date.date': 1 })
      .populate('guests.guest', 'first_name last_name photo');
    res.json({ success: true, events });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

//* get upcoming events
exports.getNamesOfUpcomingEvents = async (req, res) => {
  try {
    let userId = req.user._id;
    let events = await Events.find(
      {
        $and: [
          {
            // organizer: userId,
            $or: [{ organizer: userId }, { 'guests.guest': userId }]
          },
          {
            $or: [
              { 'end_date.date': { $gte: moment().format('L') } },
              { 'start_date.date': { $gte: moment().format('L') } }
            ]
          }
        ]
      },
      '_id name'
    ).sort({ 'start_date.date': 1 });
    res.json({ success: true, events });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

//* get past events
exports.getPastEvents = async (req, res) => {
  try {
    let userId = req.user._id;
    let events = await Events.find({
      $and: [
        {
          $or: [{ organizer: userId }, { 'guests.guest': userId }]
        },
        {
          $or: [
            { 'end_date.date': { $lt: moment().format('L') } },
            { 'start_date.date': { $lt: moment().format('L') } }
          ]
        }
      ]
    })
      .sort({ 'start_date.date': 1 })
      .populate('guests.guest', 'first_name last_name photo');
    res.json({ success: true, events });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

//* get past events
exports.getEventByID = async (req, res) => {
  try {
    let { eventId } = req.params;

    let event = await Events.findById(eventId).populate(
      'guests.guest',
      'first_name last_name photo'
    );

    res.json({ success: true, event });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

//* Update an event - only by organizer and co-organizer
exports.updateEvent = async (req, res) => {
  try {
    let userId = req.user._id;
    let { eventId } = req.params;
    let body = req.body;
    // store fille path into array
    let images = [];
    if (req.files) {
      req.files.forEach(image => {
        images.push(image.path);
      });
    }

    body.photos = [...JSON.parse(body.photos), ...images];

    body.location = JSON.parse(body.location);
    body.start_date = JSON.parse(body.start_date);
    if (req.body.end_date !== 'undefined') {
      body.end_date = JSON.parse(body.end_date);
    } else {
      body.end_date = undefined;
    }

    let event = await Events.findOneAndUpdate(
      {
        _id: eventId,
        $or: [{ organizer: userId }, { 'guests.guest': userId, 'guests.role': 'Co-Organizer' }]
      },
      body,
      { new: true }
    );
    if (!event) {
      return res.json({
        success: false,
        message: translate['Event not found.']
      });
    }

    res.json({ success: true, message: translate['Event updated.'], event });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

//* Delete Event
exports.delete = async (req, res) => {
  try {
    let event = await Events.findByIdAndDelete(req.params.eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: translate['Event not found.']
      });
    }
    res.json({ success: true, message: translate['Event deleted.'] });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

//* Remove Guest from event
exports.removeGuest = async (req, res) => {
  try {
    let { userId, eventId } = req.params;

    await Events.findOneAndUpdate({ _id: eventId }, { $pull: { guests: { guest: userId } } }).then(
      async () => {
        await Users.findOneAndUpdate(
          { _id: userId },
          { $pull: { events: { event: eventId } } }
        ).then(() =>
          res.json({
            success: true,
            message: translate['User Removed from Event.']
          })
        );
      }
    );
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

//* Create event timeline
exports.createTimeline = async (req, res) => {
  try {
    let { eventId } = req.params;
    let event = await Events.findById(eventId);
    let { body } = req;
    if (!event) {
      return res.status(400).json({ success: false, message: translate['Event not found.'] });
    }
    event.timeline.push(body);
    event.save();
    res.json({ event, message: translate['Timeline Create Successfully!'] });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

exports.editTimeline = async (req, res) => {
  try {
    let data = req.body;
    let { eventId, timelineId } = req.params;
    let event = await Events.findOneAndUpdate(
      { _id: eventId, 'timeline._id': timelineId },
      {
        $set: {
          'timeline.$': data
        }
      },
      { new: true }
    );
    res.json({
      success: true,
      message: translate['Timeline Updated Successfully!'],
      event
    });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

exports.deleteTimeline = async (req, res) => {
  try {
    let { eventId, timelineId } = req.params;
    let event = await Events.findOneAndUpdate(
      { _id: eventId },
      {
        $pull: {
          timeline: {
            _id: timelineId
          }
        }
      },
      { new: true }
    );
    res.json({
      success: true,
      message: translate['Timeline Deleted Successfully!'],
      event
    });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

// Get Wishlist
exports.wishlists = async (req, res) => {
  try {
    const { eventId } = req.params;
    let { sort } = req.query;
    sort = sort === 'true';
    let wishlist = await Wishlists.find({ event: eventId })
      .populate('paid.user', 'first_name last_name photo ')
      .populate('user', 'bank.stripeID');

    // calcs
    wishlist.forEach((item, index) => {
      let sum = item.paid.reduce((prev, cur) => {
        return prev + cur.amount;
      }, 0);

      let remaining_amount = item.price - sum;

      wishlist[index] = {
        ...item._doc,
        sum,
        remaining_amount: remaining_amount.toFixed(2)
      };
    });

    // sort
    wishlist.sort((a, b) => {
      if (sort) {
        return a.remaining_amount - b.remaining_amount;
      } else {
        return b.remaining_amount - a.remaining_amount;
      }
    });

    res.json({ success: true, wishlist, sort });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

// Create wishlist
exports.CreateWishlists = async (req, res) => {
  try {
    const { eventId } = req.body;

    let event = await Events.findById(eventId);
    if (!event) {
      return res.status(400).json({ message: translate['Event not found.'] });
    }

    if (req.file) {
      req.body.image = req.file.path;
    }

    req.body.event = eventId;

    let wishlist = await Wishlists.create(req.body);

    res.json({
      success: true,
      wishlist,
      message: translate['Wishlist created.']
    });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

exports.deleteWishlistItem = async (req, res) => {
  try {
    let { itemId } = req.params;
    await Wishlists.findByIdAndDelete(itemId).then(() => {
      res.json({ success: true, message: translate['Item deleted.'] });
    });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

exports.payAmount = async (req, res) => {
  try {
    let { itemId } = req.params;
    let { amount } = req.body;
    let user = req.user._id;
    let item = await Wishlists.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: translate['No Item found.'] });
    }
    item.paid.push({ amount, user });
    item.save();

    res.json({ success: true, message: translate['Payment Successful.'] });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

exports.uploadPictures = async (req, res) => {
  try {
    let { eventId } = req.params;
    let { from } = req.body;
    let pictures = [];
    if (req.files) {
      req.files.forEach(picture => {
        let doc = {
          event: eventId,
          picture: picture.path,
          from: from
        };
        pictures.push(doc);
      });
    }
    Pictures.insertMany(pictures)
      .then(() => {
        res.json({ message: translate['Pictures Uploaded.'], success: true });
      })
      .catch(err => {
        throw err;
      });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

exports.getPicturesNeedApproval = async (req, res) => {
  try {
    let { eventId } = req.params;
    let pictures = await Pictures.find({
      event: eventId,
      status: 'pending'
    })
      .populate('from', 'first_name last_name photo')
      .sort({ createdAt: -1 });
    res.json({ pictures });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

exports.getApprovedPictures = async (req, res) => {
  try {
    let { eventId } = req.params;
    let { user } = req.query;
    let pictures = await Pictures.find({
      $or: [
        {
          event: eventId,
          status: 'approved'
        },
        {
          event: eventId,
          from: user
        }
      ]
    })
      .populate('from', 'first_name last_name photo')
      .sort({ createdAt: -1 });
    res.json({ pictures, user });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

exports.changePictureStatus = async (req, res) => {
  try {
    let { pictureId } = req.params;
    let { status } = req.body;
    let picture = await Pictures.findById(pictureId);
    if (status === 'approved') {
      //update
      picture.status = status;
      picture.save();
      return res.json({ message: translate['Image approved.'] });
    } else {
      // delete
      fs.unlink(picture.picture, async err => {
        if (err) {
          console.log(err, 'err');
        } else {
          await Pictures.findByIdAndDelete(pictureId);
        }
      });
      return res.json({ message: translate['Image Deleted.'] });
    }
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

exports.getLikedPictures = async (req, res) => {
  try {
    let { eventId, userId } = req.params;
    let pictures = await Pictures.find({
      event: eventId,
      'likes.user': userId
    })
      .populate('from', 'first_name last_name photo')
      .sort({ createdAt: -1 });
    res.json({ pictures });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

exports.likePicture = async (req, res) => {
  try {
    let { pictureId, userId } = req.params;
    let picture = await Pictures.findById(pictureId);

    // check if already liked then remove like

    let alreadyLiked = await Pictures.findOne({
      _id: pictureId,
      'likes.user': userId
    });
    if (alreadyLiked) {
      //dislike
      await Pictures.findByIdAndUpdate(
        pictureId,
        {
          $pull: { likes: { user: userId } }
        },
        { new: true }
      ).then(resp => {
        return res.json({ picture: resp, message: translate['Like Removed.'] });
      });
    } else {
      // like
      picture.likes.push({ user: userId });
      picture.save();

      return res.json({ picture, message: translate['Image liked.'] });
    }
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};

exports.approveAllImages = async (req, res) => {
  try {
    let { eventId } = req.params;
    await Pictures.updateMany(
      {
        event: eventId,
        status: 'pending'
      },
      {
        $set: { status: 'approved' }
      }
    ).then(() => {
      return res.json({
        success: true,
        message: translate['Images Approved.']
      });
    });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: translate['Internal server error'] });
  }
};
