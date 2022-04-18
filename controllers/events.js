const Events = require("../models/Events");
const Users = require("../models/Users");

//* Create and event
exports.create = async (req, res) => {
  try {
    let userId = req.user._id;
    let user = await Users.findById(userId);
    if (!user) {
      return res.status(409).json({
        success: false,
        message: "Service Provider Cannot create event.",
      });
    }
    // Generate a random code
    let code = Math.random().toFixed(10).slice(-10);
    code = code.match(/.{1,3}/g);
    code = code.slice(0, -1).join("-") + code.slice(-1);

    // store fille path into array
    let images = [];
    if (req.files) {
      req.files.forEach((image) => {
        images.push(image.path);
      });
    }

    // create event object
    let event = new Events(req.body);
    event.code = code;
    event.location = JSON.parse(req.body.location);
    event.organizer = userId;
    event.photos = images;
    event.save();

    let userEvent = {
      event: event._id,
      role: "Organizer",
    };

    // update events array in user data
    user.events.push(userEvent);
    user.save();

    res.json({ success: true, message: "Event Created Successfully.", event });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
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
        message: "Service Provider Cannot join event as Guest.",
      });
    }
    let event = await Events.findOne({ code });
    if (!event) {
      return res.status(409).json({
        success: false,
        message: "Event not found.",
      });
    }
    let alreadyMember = await Events.findOne({ code, "guests.guest": userId });
    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message: "You are already a member of this event.",
      });
    }
    if (event.organizer == userId) {
      return res.status(409).json({
        success: false,
        message: "Organizer cannot join event as guest.",
      });
    }
    let guest = { guest: userId, members };
    event.guests.push(guest);
    event.save();

    let userEvent = {
      event: event._id,
      role: "Guest",
    };

    // update events array in user data
    user.events.push(userEvent);
    user.save();

    res.json({
      success: true,
      message: "Event joined successfully.",
      event,
    });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//* change guest role in event
exports.changeRole = async (req, res) => {
  try {
    let { userId, eventId } = req.params;
    let event = await Events.findOne(
      {
        _id: eventId,
        "guests.guest": userId,
      },
      { "guests.$": 1 }
    );

    //* Update role by getting previous role
    let role = "Co-Organizer";
    if (event.guests[0].role === "Co-Organizer") {
      role = "Guest";
    }

    await Events.findOneAndUpdate(
      {
        _id: eventId,
        "guests.guest": userId,
      },
      {
        $set: { "guests.$.role": role },
      },
      { new: true }
    )
      .then(async (resp) => {
        await Users.findOneAndUpdate(
          {
            _id: userId,
            "events.event": eventId,
          },
          {
            $set: { "events.$.role": role },
          },
          { new: true }
        );
        res.json({
          success: true,
          message: "Guest Status Updated.",
          event: resp,
        });
      })
      .catch((err) => {
        throw err;
      });

    // res.json({ event });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
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
        "guests.guest": userId,
      },
      {
        $set: { "guests.$.status": status },
      },
      { new: true }
    )
      .then((resp) => {
        res.json({
          success: true,
          message: "Guest Status Updated.",
          event: resp,
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//* get events
exports.getEvents = async (req, res) => {
  try {
    let userId = req.user._id;
    let events = await Events.find({
      $or: [{ organizer: userId }, { "guests.guest": userId }],
    }).populate("guests.guest", "first_name last_name photo");
    res.json({ success: true, events });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
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
      req.files.forEach((image) => {
        images.push(image.path);
      });
    }

    body.photos = images;

    let event = await Events.findOneAndUpdate(
      {
        _id: eventId,
        $or: [
          { organizer: userId },
          { "guests.guest": userId, "guests.role": "Co-Organizer" },
        ],
      },
      body,
      { new: true }
    );
    if (!event) {
      return res.json({
        success: false,
        message: "Event not found.",
      });
    }
    res.json({ success: true, event });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//* Remove Guest from event
exports.removeGuest = async (req, res) => {
  try {
    let { userId, eventId } = req.params;

    await Events.findOneAndUpdate(
      { _id: eventId },
      { $pull: { guests: { guest: userId } } }
    ).then(async () => {
      await Users.findOneAndUpdate(
        { _id: userId },
        { $pull: { events: { event: eventId } } }
      ).then(() =>
        res.json({ success: true, message: "User Removed from Event." })
      );
    });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
