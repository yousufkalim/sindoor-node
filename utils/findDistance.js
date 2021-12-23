/**
 * Services schema
 * @author Yousuf Kalim
 * @codeby Shuja Naqvi
 */
exports.findDistance = (latitude, longitude, services) => {
  try {
    var R = 6371;
    var nearbyServices = [];
    lat2 = parseFloat(latitude);
    lon2 = parseFloat(longitude);
    for (var i = 0; i < services.length; i++) {
      if (
        services[i].location.lat != undefined &&
        services[i].location.lng != undefined
      ) {
        var lat1 = services[i].location.lat;
        var lon1 = services[i].location.lng;
        var dLat = parseFloat(((lat2 - lat1) * Math.PI) / 180); // deg2rad below
        var dLon = parseFloat(((lon2 - lon1) * Math.PI) / 180);
        var a = parseFloat(
          0.5 -
            Math.cos(dLat) / 2 +
            (Math.cos((lat1 * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              (1 - Math.cos(dLon))) /
              2
        );
        var distance = parseFloat(R * 2 * Math.asin(Math.sqrt(a)));
        console.log(distance);
        if (distance < 25) {
          nearbyServices.push(services[i]);
        }
      }
    }
    return nearbyServices;
  } catch (err) {
    console.log(err.message);
  }
};
