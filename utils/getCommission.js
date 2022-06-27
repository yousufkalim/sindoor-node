exports.getCommission = (amount) => {
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
};
