import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function MyOrder() {
  const [orderData, setOrderData] = useState(null);

  const fetchMyOrder = async () => {
    try {
      await fetch("https://go-food-backend-ykrv.onrender.com/api/auth/myOrderData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
        }),
      }).then(async (res) => {
        let response = await res.json();
        setOrderData(response);
      });
    } catch (error) {
      console.log("Error fetching orders", error);
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          {orderData && orderData.orderData ? (
            orderData.orderData.order_data
              .slice(0)
              .reverse()
              .map((item, index) => {
                return item.map((arrayData, subIndex) => {
                  return (
                    <div key={`${index}-${subIndex}`} className="w-100">
                      {arrayData.Order_date ? (
                        <div className="m-auto mt-5">
                          <div className="fs-4 mt-3">
                            {" "}
                            {arrayData.Order_date}{" "}
                          </div>
                          <hr />
                        </div>
                      ) : (
                        <div className="col-12 col-md-6 col-lg-3 d-inline-block">
                          <div
                            className="card mt-3"
                            style={{ width: "16rem", maxHeight: "360px" }}
                          >
                            {/* <img src={arrayData.img} className="card-img-top" alt="..." style={{ height: "120px", objectFit: "fill" }} /> */}
                            <div className="card-body">
                              <h5 className="card-title">{arrayData.name}</h5>
                              <div
                                className="container w-100 p-0"
                                style={{ height: "38px" }}
                              >
                                <span className="m-1">{arrayData.qty}</span>
                                <span className="m-1">{arrayData.size}</span>
                                <div className="d-inline ms-2 h-100 w-20 fs-5">
                                  ₹{arrayData.price}/-
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })
          ) : (
            <div className="m-5 text-center w-100 mt-5">No Orders Found</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
