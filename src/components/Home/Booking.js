import React, { useEffect, useState } from "react";
import Header from '../common/Header'
import Footer from '../common/Footer'
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { updateSeat, booking } from "../../store/eventSlice";
import { addBookingHistory } from "../../store/authSlice";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

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
    dispatch(booking({ id }));
    dispatch(
      addBookingHistory({ eventId: id, tierCount, ticketCountPerBooking })
    );
    navigate("/");
  };

  useEffect(() => {
    if (errorMessage) {
      setShow(true);
      setMessage(errorMessage);
    }
  }, [errorMessage]);

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
              onClose={() => setShow(false)}
              show={show}
              delay={30000}
              autohide
              className="bg-danger"
            >
              <Toast.Body>{message}</Toast.Body>
            </Toast>
          </ToastContainer>
          <Col>
            {event.seats.seatCategory.map((seat, index) => {
              return (
                <Row className="seat-list mb-4">
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
          </Col>
        </Row>
        <Row className="bottom-fix ">
          <Col>
            <Row className="fw-bold">₹{finalPrice}</Row>
            <Row> {ticketCountPerBooking} tickets</Row>
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
