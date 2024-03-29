import { DialogHTMLAttributes, useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
// import "./style.css";

import st from "./style/storage-style.module.css";
import BillItemModel from "../../models/BillItemModel";
import React from "react";
import { axiosPrivate } from "../../api/axios";
import { useAxiosPrivate } from "../../api/useAxiosHook";
import BookDetail from "../BookDetail/BookDetail";
import ModalBookDetail from "../BookDetail/ModalBookDetail";
import OrderModel from "../../models/OrderModel";
import { OrderTable } from "./OrderComponents/Order/OrderTable";
import { Bill } from "./OrderComponents/Bill/Bill";
import OrderDetailModel from "../../models/OrderDetailModel";
import ModalOrder from "./OrderComponents/Order/ModalOrder";
import Papa from "papaparse";


export const OrderHistory = () => {
  const axios = useAxiosPrivate();
  const [orderList, setOrderList] = useState<OrderModel[]>([]);
  const [httpError, setHttpError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetailItems, setOrderDetailItems] = useState<OrderDetailModel[]>(
    []
  ); //OrderItem=OrderdetailModel
  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [currentOrder, setCurrentOrder] = useState<OrderModel>();

  useEffect(() => {
    // let baseUrl: string = "http://localhost:8081/orders";
    // let url: string = "";

    // if (searchKeyWord !== "") {
    //   url = `${baseUrl}/${searchKeyWord}`;
    //   console.log(url);
    // } else {
    //   url = `${baseUrl}`;
    // }
    // const getOrderById = async () => {
    //   const response = await axiosPrivate(url);

    //   // const responseJson = await response.json();
    //   console.log(responseJson);
    //   const tempOrderList: OrderModel[] = [];
    //   tempOrderList.push({
    //     id: responseJson.id,
    //     createDate: responseJson.createDate,
    //     username: responseJson.username,
    //     customer: responseJson.customer,
    //     total: responseJson.total,
    //     orderDetails: responseJson.orderDetails,
    //     giftcode: responseJson.giftcode
    //   });
    //   setOrderList(tempOrderList);
    //   setIsLoading(false);
    // };

    // GetOrderListAxios
    const getOrderListAxios = async () => {
      try {
        const response: OrderModel[] = await axios({
          method: "get",
          url: "http://localhost:8081/orders",
        });
        console.log(response);
        const list = response as OrderModel[];
        console.log("List order: " + list);
        setOrderList(list);
      } catch (error) {
        console.log(error);
      }
    };

    getOrderListAxios().catch((e) => {
      console.log(e);
    });


  }, []);


  const openModalDetail = async (id: number) => {
    const temp: OrderModel =
      orderList[orderList.findIndex((order) => order.id === id)];
    setCurrentOrder(temp);

    try {
      const response = await getOrderDetailItemsAxios(temp.id);
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    if (temp != null) {
      const modal: any = document.querySelector("[data-order-detail]");
      modal.showModal();
    } else {
      // Xử lý khi đối tượng là null hoặc undefined
    }
  };

  const closeModalDetail = () => {
    const modal: any = document.querySelector("[data-order-detail]");
    modal.close();
  };

  // GetOrderDetailItemsAxios
  const getOrderDetailItemsAxios = async (id: number | undefined) => {
    try {
      const response: OrderDetailModel[] = await axios({
        method: "get",
        url: "http://localhost:8081/orderdetail/" + id,
      });
      console.log(response);
      const list = response as OrderDetailModel[];
      console.log("List orderDetail: " + JSON.stringify(list));
      setOrderDetailItems(list);
      return list; // Trả về kết quả
    } catch (error) {
      console.log(error);
      throw error; // Ném lỗi để xác định lỗi
    }
  };

  const chooseOneOrder = async (id: number) => {
    const temp: OrderModel =
      orderList[orderList.findIndex((order) => order.id === id)];
    if (temp) {
      setCurrentOrder(temp);
      console.log(temp);

      try {
        const response = await getOrderDetailItemsAxios(temp.id);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleOnClickExportOrder = () => {
    if(orderList.length === 0) {
      return;
    } 
    const data = orderList.map((order)=>[
      order.id,
      order.createDate,
      order.username,
      order.customer ? order.customer.fullName : 'Vister',
      order.total
    ])
    const fields = ['ID', 'DATE','EMPLOYEE', 'CUSTOMER', 'TOTAL'];

    const csv = Papa.unparse({
      data,
      fields
    })
    const blob:Blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const a:HTMLAnchorElement = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'orders.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <>
      <div className={`${st.storageDesktop} d-none d-lg-flex`}>
        {/* Desktop */}

        <OrderTable
          orderList={orderList}
          searchKeyWord={''}
          setSearchKeyWord={() => { }}
          chooseOneOrder={chooseOneOrder}
          openModalDetail={openModalDetail}
        />

        <Bill
          orderDetailItems={orderDetailItems}
        ></Bill>

      </div>
      <div className={`${st.storageDesktop} d-block d-lg-none`}>
        {/* Desktop */}
        <OrderTable
          orderList={orderList}
          // addToBill={handleAddToBill}
          searchKeyWord={''}
          setSearchKeyWord={() => { }}
          chooseOneOrder={chooseOneOrder}
          openModalDetail={openModalDetail}
        />
        <Bill
          orderDetailItems={orderDetailItems}
        // setQuantity={setQuantity}
        // removeBillItem={removeBillItem}
        // checkOut={checkOut}
        ></Bill>
      </div>

      <dialog style={{borderRadius:16}} data-order-detail className={`${st.modal}`}>
        <div className=" d-flex justify-content-end ">
          <button
            type="button"
            className="btn-close"
            onClick={closeModalDetail}
            aria-label="Close"
          ></button>
        </div>
        <ModalOrder
          currentOrder={currentOrder}
          orderDetailItems={orderDetailItems}
        ></ModalOrder>
      </dialog>
      <div className="d-flex flex-column" style={{ position: 'fixed', bottom: 30, right: 30 }}>
        <button className="btn btn-primary p-2 mt-2" onClick={handleOnClickExportOrder} id="btnExportCustomer"><i className="fa-solid fa-file-export fa-xl"></i></button>
      </div>
    </>
  );
};
export default OrderHistory;
