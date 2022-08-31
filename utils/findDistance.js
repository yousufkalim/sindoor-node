exports.findDistance = async (lat, lng, radius, services) => {
  try {
    // Using Haversine formula to calculate distance
    // for info http://www.movable-type.co.uk/scripts/latlong.html
    // to check results https://www.wolframalpha.com/input?i=16.207267N+-61.497477W+to+16.207767N+-61.497477W+in+km

    var R = 6371; // metres
    var Services = [];

    const lat2 = parseFloat(lat);
    const lon2 = parseFloat(lng);

    services.forEach((item, index) => {
      let lat1 = item.location.lat;
      let lng1 = item.location.lng;

      var dLat = parseFloat(((lat2 - lat1) * Math.PI) / 180);
      var dLon = parseFloat(((lon2 - lng1) * Math.PI) / 180);

      var a = parseFloat(
        0.5 -
          Math.cos(dLat) / 2 +
          (Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            (1 - Math.cos(dLon))) /
            2
      );

      var distance = parseFloat(R * 2 * Math.asin(Math.sqrt(a)));

      if (!radius || distance <= +radius) {
        Services.push({ ...item, distance });
      }
    });

    return Services;
  } catch (err) {
    console.log(err, "Distance Error");
  }
};
