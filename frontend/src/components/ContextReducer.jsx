import React, { useReducer, useContext, createContext } from "react";

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        {
          id: action.id,
          name: action.name,
          qty: action.qty,
          size: action.size,
          price: action.price,
          img: action.img,
        },
      ];

    case "REMOVE":
      let newArr = [...state];
      newArr.splice(action.index, 1);
      return newArr;

    case "DROP":
      return []; // Empty the array

    case "UPDATE":
      // Find index of the item to update
      let arr = [...state];
      let index = arr.findIndex(
        (food) => food.id === action.id && food.size === action.size
      );

      if (index !== -1) {
        arr[index] = {
          ...arr[index],
          qty: parseInt(action.qty) + arr[index].qty,
          price: action.price + arr[index].price,
        };
      }
      return arr;

    default:
      console.log("Error in Reducer");
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
