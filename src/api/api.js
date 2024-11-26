/**
 * Mocking client-server processing
 */
import data from "./user.json";

const TIMEOUT = 2000;

const api = {
  loginApi: (logObj, timeout) =>
    new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (
          logObj.username === data.user.email &&
          logObj.password === data.user.password
        ) {
          resolve(data.user.userid);
        } else {
          reject("Invalid user or password");
        }
      }, timeout || TIMEOUT);
    }),
  eventList: (eventObj, timeout) =>
    new Promise(function (resolve, reject) {
      setTimeout(function () {
        let dataArray = [];
        let catFilter = eventObj.filter.category;
        let priceFilter = eventObj.filter.price;
        if (catFilter.length > 0) {
          dataArray = data.events.filter(
            ({ category, price }) =>
              catFilter.includes(category) &&
              price >= priceFilter[0] &&
              price <= priceFilter[1]
          );
        } else if (priceFilter[0] > 0 || priceFilter[1] < 500) {
          dataArray = data.events.filter(
            ({ price }) => price >= priceFilter[0] && price <= priceFilter[1]
          );
        } else {
          dataArray = data.events;
        }
        console.log(eventObj.start, eventObj.limit);
        const hasMore = eventObj.start <= dataArray.length;
        let eventList = [];
        if (dataArray.length > 0) {
          if (hasMore) {
            eventList = dataArray.slice(
              eventObj.start,
              eventObj.start + eventObj.limit
            );
          } else {
            eventList = [];
          }
          resolve({ eventList, hasMore, new: eventObj.new });
        } else {
          reject({ message: "No events", hasMore });
        }
      }, timeout || TIMEOUT);
    }),
};

export default api;
