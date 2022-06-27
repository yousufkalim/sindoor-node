/**
 * Booking CRUD controllers
 * @author Najam Ul Saqib
 */

const moment = require("moment");
const Bookings = require("../models/Bookings");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { getCommission } = require("../utils/getCommission");

exports.SendRequest = async (req, res) => {
  try {
    let { body } = req;
    let duration = moment(body.end_date).diff(
      moment(body.start_date),
      "minute"
    );

    duration = (duration / 60).toFixed(1);

    body.duration = duration;

    let booking = new Bookings(body);

    booking.save();

    res.json({
      success: true,
      message: "Request sent to Service Provider.",
      booking,
    });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getRequests = async (req, res) => {
  try {
    let { userId } = req.params;
    let requests = await Bookings.find({
      serviceProvider: userId,
      paid: "nill",
      status: { $in: ["accepted", "pending"] },
    })
      .sort("-createdAt")
      .populate(
        "service user event",
        "name first_name last_name location type photo description"
      );
    res.json({ success: true, requests });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getBookings = async (req, res) => {
  try {
    let { userId } = req.params;
    let requests = await Bookings.find({
      serviceProvider: userId,
      status: "accepted",
      paid: { $in: ["deposit", "paid"] },
    })
      .sort("start_date")
      .populate(
        "service user event",
        "name first_name last_name location type photo description"
      );
    res.json({ success: true, requests });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getFewBookings = async (req, res) => {
  try {
    let { userId } = req.params;
    let requests = await Bookings.find({
      serviceProvider: userId,
      status: "accepted",
      paid: { $in: ["deposit", "paid"] },
    })
      .sort("start_date")
      .limit(5)
      .populate(
        "service user event",
        "name first_name last_name location type photo description"
      );
    res.json({ success: true, requests });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getRequestsByEventId = async (req, res) => {
  try {
    let { eventId } = req.params;
    let bookings = await Bookings.find({
      event: eventId,
      status: { $in: ["accepted", "pending"] },
    }).populate(
      "service user event serviceProvider",
      "name first_name last_name location type photo company_name bank"
    );
    res.json({ success: true, bookings });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getById = async (req, res) => {
  try {
    let { bookingId } = req.params;
    let booking = await Bookings.findById(bookingId).populate(
      "service user event serviceProvider",
      "name first_name last_name location type photo company_name bank"
    );
    res.json({ success: true, booking });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    let { requestId } = req.params;
    let { final_price, deposit_price } = req.body;
    if (+deposit_price > +final_price) {
      return res.status(400).json({
        success: false,
        message: "Deposit price must be lower than final price.",
      });
    }
    await Bookings.findByIdAndUpdate(requestId, {
      final_price,
      deposit_price,
      status: "accepted",
    });

    res.json({ message: "Price / Status Updated." });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    let { requestId } = req.params;

    await Bookings.findByIdAndUpdate(requestId, { status: "rejected" });

    res.json({ message: "Request rejected." });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Stripe Checkout method
exports.checkOut = async (req, res) => {
  try {
    let line_items = req.body.line_items;
    let data = req.body.data;

    let { unit_amount } = data;
    console.log(unit_amount, unit_amount - getCommission(unit_amount));
    let amount_to_send = unit_amount - getCommission(unit_amount); // deducting commission here

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      locale: "fr",
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/redirect=true&success=true`,
      cancel_url: `${process.env.CLIENT_URL}/redirect=true&success=false`,
      payment_intent_data: {
        transfer_data: {
          destination: data.stripe,
          amount: amount_to_send,
        },
      },
      metadata: {
        type: data.type,
        request: data.request,
        user: data.user,
        payment: data.payment,
      },
    });

    res.json({ success: true, url: session.url });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Stripe Webhook
exports.webhook = async (req, res) => {
  let sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.WEBHOOK_SEC
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object; // get session
      const { metadata } = session; // get metadata

      let { payment, request, user } = metadata;

      let booking = await Bookings.findById(request);
      booking.paid = payment;
      booking.payment_history.push({
        user,
        date: new Date(),
        amount:
          payment === "deposit" ? booking.deposit_price : booking.final_price,
      });
      booking.save();
    }
    default: {
      console.log(`Unhandled event type ${event.type}`);
    }
  }
  res.send();
};

exports.canRateInfo = async (req, res) => {
  try {
    let { userId, serviceProviderId } = req.params;
    let bookingsCount = await Bookings.countDocuments({
      $and: [
        { paid: "paid" },
        { serviceProvider: serviceProviderId },
        {
          $or: [
            {
              user: userId,
            },
            {
              "payment_history.user": userId,
            },
          ],
        },
      ],
    });

    res.json({ success: true, status: bookingsCount > 0 });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
