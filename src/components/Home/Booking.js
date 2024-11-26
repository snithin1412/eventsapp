import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { updateSeat, booking, removeErrorMessage } from "../../store/eventSlice";
import { addBookingHistory } from "../../store/authSlice";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { uniqWith } from "lodash";
import { Typography } from "@mui/material";

export const Booking = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const eventsDetails = useSelector((state) => state.events);
  const { events, tierCount, ticketCountPerBooking, finalPrice, errorMessage } =
    eventsDetails;
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.filter((ev) => ev.eventId === +id)[0];
  const userDetails = useSelector((state) => state.auth);
  const { bookingHistory } = userDetails;
  console.log(bookingHistory);
  const userTotalTicket = bookingHistory.reduce(
    (acc, ticket) => acc + ticket.ticketCountPerBooking,
    0
  );

  const handleTickets = (seatCategory, operator) => {
    dispatch(
      updateSeat({ id, event, operator, seatCategory, userTotalTicket })
    );
  };

  const handleBooking = () => {
    if (ticketCountPerBooking > 0) {
    dispatch(booking({ id }));
    dispatch(
      addBookingHistory({ eventId: id, tierCount, ticketCountPerBooking })
    );
    navigate("/");
    } else {
      setShow(true);
      setMessage("No tickets selected");
    }
  };

  const getLastBookedDetails = bookingHistory.filter(ev => ev.eventId === id).reduce( (acc, ticket) => acc + ticket.ticketCountPerBooking, 0);
  console.log(getLastBookedDetails)
 

  useEffect(() => {
    if (errorMessage) {
      setShow(true);
      setMessage(errorMessage);
    }
  }, [errorMessage]);

  const hideToast = () => {
    setShow(false)
    dispatch(removeErrorMessage())
  }

  return (
    <>
      <Header />
      <Container className="home-wrapper pe-0 pb-60 ps-0">
        <Row className="home-banner mb-4">
          <Col>
            <Row className="banner-heading ps-0 justify-content-center">
              Book Tickets
            </Row>
          </Col>
        </Row>
        <Row>
          <ToastContainer
            className="p-3 bottom5"
            position={"bottom-end"}
            style={{ zIndex: 1, bottom: "5rem !important" }}
          >
            <Toast
              onClose={hideToast}
              show={show}
              delay={5000}
              autohide
              className="bg-danger text-white"
            >
              <Toast.Body>{message}</Toast.Body>
            </Toast>
          </ToastContainer>
          <Col>
            {event?.seats.seatCategory.map((seat, index) => {
              return (
                <Row className="seat-list mb-4" key={`tier-${index}`}>
                  <Col>
                    <Row className="ps-4 pt-2 pb-1 text-uppercase fw-bold">
                      {seat.category}
                    </Row>
                    <Row className="ps-4 fw-bold">₹ {seat.price}</Row>
                  </Col>
                  <Col style={{ paddingTop: "12px" }}>
                    <InputGroup className="mb-3 justify-content-end">
                      <Button
                        variant="outline-secondary"
                        id="button-addon1"
                        onClick={() => handleTickets(seat.category, "remove")}
                      >
                        -
                      </Button>
                      <Form.Control
                        className="text-center"
                        type="number"
                        min={0}
                        max={5}
                        style={{ maxWidth: "50px" }}
                        readOnly
                        value={tierCount[seat.category]}
                      />

                      <Button
                        variant="outline-secondary"
                        id="button-addon1"
                        onClick={() => handleTickets(seat.category, "add")}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </Col>
                </Row>
              );
            })}
            <Typography className="text-start ticket-history pt-2" sx={{color: "#66bb6a"}}>{getLastBookedDetails && `You've already reserved ${getLastBookedDetails} tickets.`}</Typography>
          </Col>
        </Row>
        <Row className="bottom-fix ">
          <Col>
            <Row className="fw-bold">
              {finalPrice !== 0 && `₹${finalPrice}`}
            </Row>
            <Row>
              {" "}
              {ticketCountPerBooking !== 0 &&
                `${ticketCountPerBooking} tickets`}
            </Row>
          </Col>
          <Col>
            <Row>
              <Button
                variant="outline-danger"
                id="book-button"
                onClick={() => handleBooking(id)}
              >
                Book
              </Button>
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};
