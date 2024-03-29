import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";

import st from "../../../../style/customer-infor-and-checkout-styled.module.css";
import styled from "styled-components";
import { CustomerModel } from "../../../../../../models/CustomerModel";
import { useEffect, useState } from "react";
import BillItemModel from "../../../../../../models/BillItemModel";
import checkOutIcon from "../../../../../../images/bill.png";

const CheckOutSectionStyled = styled.div`
  grid-row: 1/3;
  grid-column: 2/3;
  text-align: center;
`;

const Cursive = styled.span`
  font-family: cursive;
`;

export const CustomerInforAndCheckOut: React.FC<{
  customer: CustomerModel;
  onClickCheckOut: Function;
  billItems: BillItemModel[];
}> = (props) => {
  const [subTotal, setSubTotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    let tempSubtotal = 0;
    props.billItems.forEach((item) => {
      tempSubtotal += item.quantity * item.book.price;
    });

    setSubTotal(tempSubtotal);
  }, []);
  useEffect(() => {
    if (props.customer.ranking) {
      setTotal(subTotal * (10 - props.customer.ranking) * 0.1);
    } else {
      setTotal(subTotal);
    }
  }, [subTotal, props.customer]);

  const handleOnClickCheckOut = () => {
    props.onClickCheckOut();
  };

  return (
    <CheckOutSectionStyled className={`${st.checkoutSection}`}>
      <Card style={{ height: "100%" }}>
        <CardHeader>
          <Card.Img
            variant="left"
            src={checkOutIcon}
            width={30}
            height="auto"
          ></Card.Img>
          <Card.Title as="h5" className="ms-2">
            Checkout
          </Card.Title>
        </CardHeader>
        <CardBody>
          <div className="d-flex flex-column">
            <div className={`${st.customerInforSection}`}>
              <ListGroup variant="flush" as="ol">
                <ListGroupItem style={{ textAlign: "left" }} as="li">
                  Username: <Cursive>{" Temporary username"}</Cursive>
                </ListGroupItem>
                <ListGroupItem style={{ textAlign: "left" }}>
                  Customer: <Cursive>{props.customer.fullName}</Cursive>
                </ListGroupItem>
                <ListGroupItem style={{ textAlign: "left" }}>
                  Phone: <Cursive>{props.customer.phoneNumber}</Cursive>
                </ListGroupItem>
                <ListGroupItem style={{ textAlign: "left" }}>
                  Ranking: <Cursive>{props.customer.ranking}</Cursive>
                </ListGroupItem>
              </ListGroup>
              <InputGroup size="sm" className="mb-3 mt-3">
                <InputGroup.Text>GIFTCODE</InputGroup.Text>
                <Form.Control
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-sm"
                />
                <Button variant="success">APPLY</Button>
              </InputGroup>
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <div className="checkoutSection d-flex m-1 flex-column align-items-end">
            <h4>{`Subtotal: $${subTotal}`}</h4>
            <h4 className="text-success">{`Total: $${total}`}</h4>
            <p style={{ fontSize: 12, color: "gray" }}>{`Saved: $${
              subTotal - total
            }`}</p>
            <button
              onClick={handleOnClickCheckOut}
              className={`btn btn-success w-100`}
            >
              Checkout
            </button>
          </div>
        </CardFooter>
      </Card>
    </CheckOutSectionStyled>
  );
};
