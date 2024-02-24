import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, reset, incrementByAmount } from "./counterSlice";
import { useCallback, useState } from "react";

interface RootState {
  counter: {
    count: number;
  };
}
const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.count);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState<number | string>(0);
  const addValue = Number(incrementAmount) || 0;
  const resetAll = () => {
    setIncrementAmount(0);
    dispatch(reset());
  };
  const handleIncrementChange = useCallback(
    (addValue: string | number) => {
      if (typeof addValue === "number") {
        dispatch(incrementByAmount(addValue));
      }
    },
    [incrementAmount]
  );
  return (
    <section>
      <p>Counter</p>
      <p>{count}</p>
      <div>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button>
      </div>
      <input
        type="text"
        value={incrementAmount}
        onChange={(e) => setIncrementAmount(e.target.value)}
      />
      <div>
        <button onClick={() => handleIncrementChange(addValue)}>
          Add amount
        </button>
        <button onClick={resetAll}>Reset all</button>
      </div>
    </section>
  );
};

export default Counter;
