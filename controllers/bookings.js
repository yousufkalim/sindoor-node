/**
 * Booking CRUD controllers
 * @author Najam Ul Saqib
 */

const moment = require("moment");
const Bookings = require("../models/Bookings");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

function getCommission(amount) {
  amount = parseFloat(amount, 10) / 100; // converting amount in euros
  let commission_amount = 0;
  let commission_rules = {
    100: {
      commission: 27.2,
      variation: 0.00125,
    },
    200: {
      commission: 15.0,
      variation: 0.000417,
    },
    300: {
      commission: 10.83,
      variation: 0.000208,
    },
    400: {
      commission: 8.75,
      variation: 0.000125,
    },
    500: {
      commission: 7.5,
      variation: 0.000083,
    },
    600: {
      commission: 6.67,
      variation: 0.00006,
    },
    700: {
      commission: 6.07,
      variation: 0.000047,
    },
    800: {
      commission: 5.6,
      variation: 0.000032,
    },
    900: {
      commission: 5.28,
      variation: 0.000028,
    },
    1000: {
      commission: 5.0,
      variation: 0.000023,
    },
    1100: {
      commission: 4.77,
      variation: 0.000019,
    },
    1200: {
      commission: 4.58,
      variation: 0.000016,
    },
    1300: {
      commission: 4.42,
      variation: 0.000013,
    },
    1400: {
      commission: 4.29,
      variation: 0.000012,
    },
    1500: {
      commission: 4.17,
      variation: 0.000011,
    },
    1600: {
      commission: 4.06,
      variation: 0.000009,
    },
    1700: {
      commission: 3.97,
      variation: 0.000008,
    },
    1800: {
      commission: 3.89,
      variation: 0.000008,
    },
    1900: {
      commission: 3.81,
      variation: 0.000006,
    },
    2000: {
      commission: 3.75,
      variation: 0.000006,
    },
    2100: {
      commission: 3.69,
      variation: 0.000005,
    },
    2200: {
      commission: 3.64,
      variation: 0.000005,
    },
    2300: {
      commission: 3.59,
      variation: 0.000005,
    },
    2400: {
      commission: 3.54,
      variation: 0.000004,
    },
    2500: {
      commission: 3.5,
      variation: 0.000004,
    },
    2600: {
      commission: 3.46,
      variation: 0.000003,
    },
    2700: {
      commission: 3.43,
      variation: 0.000004,
    },
    2800: {
      commission: 3.39,
      variation: 0.000003,
    },
    2900: {
      commission: 3.36,
      variation: 0.000003,
    },
    3000: {
      commission: 3.33,
      variation: 0.000002,
    },
    3100: {
      commission: 3.31,
      variation: 0.000003,
    },
    3200: {
      commission: 3.28,
      variation: 0.000002,
    },
    3300: {
      commission: 3.26,
      variation: 0.000002,
    },
    3400: {
      commission: 3.24,
      variation: 0.000004,
    },
    3500: {
      commission: 3.21,
      variation: 0,
    },
  };
  if (amount <= 3.33) {
    commission_amount = 1;
  } else if (amount < 100) {
    let floor_amount = Math.floor(amount / 10) * 10;
    if (floor_amount === 0) {
      floor_amount = amount;
    }
    let remaining_amount = amount - 3.34;
    remaining_amount = parseFloat(
      remaining_amount.toFixed(2).replace(".", ""),
      10
    );

    let variation_percentage = 0.00025 * remaining_amount;
    commission_amount = parseFloat(
      (
        (parseFloat((30 - variation_percentage).toFixed(6).slice(0, 5)) *
          amount) /
        100
      )
        .toFixed(6)
        .slice(0, 6)
    );
  } else if (amount < 3500) {
    // applying rules
    let floor_amount = Math.floor(amount / 100) * 100;

    let remaining_amount = amount - floor_amount;
    remaining_amount = parseFloat(remaining_amount.toFixed(2).replace(".", ""));

    let variation_percentage =
      commission_rules[floor_amount].variation * remaining_amount;

    commission_amount = parseFloat(
      (
        (parseFloat(
          (commission_rules[floor_amount].commission - variation_percentage)
            .toFixed(6)
            .slice(0, 5)
        ) *
          amount) /
        100
      )
        .toFixed(6)
        .slice(0, 6)
    );
  } else {
    let floor_amount = Math.floor(amount / 100) * 100;

    let remaining_amount = amount - floor_amount;
    remaining_amount = parseFloat(remaining_amount.toFixed(2).replace(".", ""));

    let variation_percentage =
      commission_rules[3500].variation * remaining_amount;
    commission_amount = parseFloat(
      (
        (parseFloat(
          (commission_rules[3500].commission - variation_percentage)
            .toFixed(6)
            .slice(0, 5)
        ) *
          amount) /
        100
      )
        .toFixed(6)
        .slice(0, 6)
    );
  }
  return commission_amount * 100;
}
