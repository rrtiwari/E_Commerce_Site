import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";

export default function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState("");

  const loadFoodItems = async () => {
    try {
      let response = await fetch("http://localhost:5000/api/auth/foodData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      response = await response.json();
      setFoodItems(response[0]);
      setFoodCat(response[1]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadFoodItems();
  }, []);

  return (
    <div>
      <div>
        <Navbar />
      </div>

      {/* Pass search props to Carousel so the search bar works */}
      <div>
        <Carousel search={search} setSearch={setSearch} />
      </div>

      <div className="container">
        {foodCat.length > 0 ? (
          foodCat.map((data) => {
            return (
              <div className="row mb-3" key={data._id}>
                <div className="fs-3 m-3">{data.CategoryName}</div>
                <hr
                  id="hr-success"
                  style={{
                    height: "4px",
                    backgroundImage:
                      "-webkit-linear-gradient(left,rgb(0, 255, 137),rgb(0, 0, 0))",
                  }}
                />
                {foodItems.length > 0 ? (
                  foodItems
                    .filter(
                      (item) =>
                        item.CategoryName === data.CategoryName &&
                        item.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((filterItems) => {
                      return (
                        <div
                          key={filterItems._id}
                          className="col-12 col-md-6 col-lg-3"
                        >
                          <Card
                            foodName={filterItems.name}
                            item={filterItems}
                            options={filterItems.options[0]}
                            ImgSrc={filterItems.img}
                          />
                        </div>
                      );
                    })
                ) : (
                  <div> No Such Data </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="m-5 text-center">Loading...</div>
        )}
      </div>
      <Footer />
    </div>
  );
}
