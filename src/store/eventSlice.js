import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

export const eventApi = createAsyncThunk(
  "events/list",
  async (eventObj, thunkAPI) => {
    console.log(eventObj);
    return api
      .eventList(eventObj, 2000)
      .then((res) => res)
      .catch((err) => {
        console.log("err", err);
        return thunkAPI.rejectWithValue("fail");
      });
  }
);

const eventSlice = createSlice({
  initialState: {
    status: "idle",
    hasMore: true,
    start: 0,
    limit: 8,
    events: [],
    ticketCountPerBooking: 0,
    actualPrice: 0,
    finalPrice: 0,
    errorMessage: "",
    tierCount: {
      vip: 0,
      standard: 0,
      economy: 0,
    },
  },
  name: "events",
  reducers: {
    updateSeat: (state, action) => {
      const { id, operator, seatCategory, userTotalTicket } = action.payload;
      const event = state.events.filter((ev) => ev.eventId === +id);
      const index = state.events.findIndex((ev) => ev.eventId === +id);
      state.errorMessage = "";
      if (operator === "add") {
        if (userTotalTicket + state.ticketCountPerBooking < 10) {
          if (event[0].seats.availableSeats > 0) {
            let seatCat = event[0].seats.seatCategory.filter(
              (cat) => cat.category === seatCategory
            )[0];
            if (seatCat.seats > 0) {
              if (state.ticketCountPerBooking < 5) {
                state.ticketCountPerBooking += 1;
                state.actualPrice += seatCat.price;
                seatCat.seats -= 1;
                state.events[index].seats.availableSeats -= 1;
                if (state.ticketCountPerBooking > 3) {
                  state.finalPrice =
                    state.actualPrice - (state.actualPrice * 10) / 100;
                } else {
                  state.finalPrice = state.actualPrice;
                }
                state.tierCount[seatCategory] += 1;
              } else {
                state.errorMessage =
                  "Booking Limit Exceeded per session, maximum 5";
              }
            } else {
              state.errorMessage =
                "Tickets not available for this tier, Please try a different tier";
            }
          } else {
            state.errorMessage = "Tickets not available for this event";
          }
        } else {
          state.errorMessage = "You have reached maximum ticket limit";
        }
      } else {
        if (state.tierCount[seatCategory] > 0) {
          let seatCat = event[0].seats.seatCategory.filter(
            (cat) => cat.category === seatCategory
          )[0];

          state.ticketCountPerBooking -= 1;
          state.actualPrice -= seatCat.price;
          if (state.ticketCountPerBooking > 3) {
            state.finalPrice =
              state.actualPrice - (state.actualPrice * 10) / 100;
          } else {
            state.finalPrice = state.actualPrice;
          }

          seatCat.seats += 1;
          state.events[index].seats.availableSeats += 1;
          state.tierCount[seatCategory] -= 1;
        } else {
          state.errorMessage = "Error !!!";
        }
      }
    },
    booking: (state, action) => {
      const { id } = action.payload;
      const event = state.events.filter((ev) => ev.eventId === +id)[0];
      const index = state.events.findIndex((ev) => ev.eventId === +id);
      const seatsOccupied = Math.ceil(
        (event.seats.availableSeats / event.seats.totalSeats) * 100
      );
      console.log(seatsOccupied);
      console.log(event.hikeLimit);
      if (seatsOccupied <= event.hikeLimit) {
        let percentDiff = event.hikeLimit - seatsOccupied;
        if (percentDiff === 0) {
          state.events[index].price =
            state.events[index].baseprice +
            (state.events[index].baseprice * (100 - event.hikeLimit)) / 100;
          event.seats.seatCategory.forEach((_, ind) => {
            state.events[index].seats.seatCategory[ind].price =
              state.events[index].seats.seatCategory[ind].baseprice +
              (state.events[index].seats.seatCategory[ind].baseprice *
                (100 - event.hikeLimit)) /
                100;
          });
          state.events[index].hikeLimit -= 10;
        } else {
          state.events[index].price =
            state.events[index].baseprice +
            (state.events[index].baseprice *
              (100 - event.hikeLimit + percentDiff)) /
              100;
          event.seats.seatCategory.forEach((_, ind) => {
            state.events[index].seats.seatCategory[ind].price =
              state.events[index].seats.seatCategory[ind].baseprice +
              (state.events[index].seats.seatCategory[ind].baseprice *
                (100 - event.hikeLimit + percentDiff)) /
                100;
          });
          state.events[index].hikeLimit -= percentDiff;
        }
      }
      state.ticketCountPerBooking = 0;
      state.actualPrice = 0;
      state.finalPrice = 0;
      state.errorMessage = "";
      state.tierCount = {
        vip: 0,
        standard: 0,
        economy: 0,
      };
    },
    changeStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(eventApi.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(eventApi.fulfilled, (state, action) => {
      state.status = action.payload.hasMore ? "idle" : "completed";
      state.events = action.payload.new
        ? action.payload.eventList
        : [...state.events, ...action.payload.eventList];
      state.hasMore = action.payload.hasMore;
      state.start = action.payload.hasMore
        ? state.start + state.limit
        : state.start;
    });
    builder.addCase(eventApi.rejected, (state, action) => {
      console.log("the info was rejected");
      state.status = "failed";
      state.events = [];
      state.hasMore = action.payload.hasMore;
      state.start = 0;
    });
  },
});

export const { updateSeat, booking, changeStatus } = eventSlice.actions;
export default eventSlice.reducer;
