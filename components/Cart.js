import { useStateContext } from "../lib/context";
import { FaShoppingCart } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import { useEffect } from "react";
import styled from "styled-components";
import getStripe from "../lib/getStripe";
import BtnQuantity from "./_btnQuantity";

// animation variants
const card = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

const cards = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.1,
    },
  },
};

export default function Cart() {
  const { cartItems, showCart, setShowCart, setQty, totalPrice } =
    useStateContext();

  // reset Qty anytime going to a product page
  useEffect(() => {
    setQty(1);
  }, []);

  // mobile has different animation style
  const isMobile = window.innerWidth < 768; //Add the width you want to check for here (now 768px)
  let mobileVariant = {};
  if (!isMobile) {
    {
      mobileVariant = {
        ani: { x: "0%" },
        ini: { x: "50%" },
        exi: { x: "50%" },
      };
    }
  } else {
    {
      mobileVariant = {
        ani: { y: "0%" },
        ini: { y: "50%" },
        exi: { y: "50%" },
      };
    }
  }

  // payment w stripe
  const handleCheckout = async () => {
    const stripe = await getStripe();
    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartItems),
    });
    const data = await response.json();
    await stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <CartWrapper
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowCart(false)}
    >
      <SCart
        layout
        animate="ani"
        initial="ini"
        exit="exi"
        transition={{ type: "tween" }}
        variants={mobileVariant}
        onClick={(e) => e.stopPropagation()}
        id="SCart"
      >
        {showCart && (
          <CgClose id="close-cart-mobile" onClick={() => setShowCart(false)} />
        )}

        {cartItems.length < 1 ? (
          <SEmptyCart
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1>Ihr Warenkorb ist noch leer.</h1>
            <FaShoppingCart />
          </SEmptyCart>
        ) : (
          <CartItems layout variants={cards} initial="hidden" animate="show">
            {cartItems.map((item) => (
              <CartItem id="CartItem" layout variants={card} key={item.handle}>
                <img
                  src={item.image.data.attributes.formats.thumbnail.url}
                  alt={item.title}
                />
                <CardInfo>
                  <h4>{item.title}</h4>
                  <p className="italic">Preis {item.price.toFixed(2)} €</p>
                  <p>
                    <span className="bold">Menge: </span>
                    {item.quantity}
                    <span className="subtotal">
                      {" "}
                      {(item.price * item.quantity).toFixed(2)} €
                    </span>
                  </p>

                  <BtnQuantity item={item} />
                </CardInfo>
              </CartItem>
            ))}
          </CartItems>
        )}

        {cartItems.length >= 1 && (
          <Checkout layout>
            <div>
              <p className="bold">Warenwert {totalPrice.toFixed(2)} €</p>
              <p className="italic">DHL Standard Versand 0,00 €</p>
              <h4>
                Gesamt <span className="italic">inkl. MwSt.</span>{" "}
                {totalPrice.toFixed(2)} €
              </h4>
            </div>
            <button className="btn-main" onClick={handleCheckout}>
              Kasse
            </button>
          </Checkout>
        )}
      </SCart>
    </CartWrapper>
  );
}

// animation
const { motion } = require("framer-motion");

const CartWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  backdrop-filter: blur(5px);
  z-index: 10;
`;

const SCart = styled(motion.div)`
  position: relative;
  top: 2vh;
  height: 96vh;

  width: 30%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;

  background: linear-gradient(
    90deg,
    rgba(17, 17, 17, 1) 0%,
    rgba(0, 0, 0, 1) 100%
  );
  opacity: 0.98;
  z-index: 11;

  > svg {
    display: none;
  }
`;
const CartItems = styled(motion.div)``;

const CartItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  margin: 1rem 2rem;
  max-height: 12rem;

  img {
    max-height: 16rem;
    margin: 0 10% 0 5%;
  }
`;

const CardInfo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .subtotal {
    padding: 0.3rem 0 0.3rem 1rem;
    margin: 0.2rem 0 0.2rem 1rem;

    background: rgba(255, 255, 255, 0.15);
    border-top-left-radius: 0.3rem;
    border-bottom-left-radius: 0.3rem;
  }
`;

const Checkout = styled(motion.div)`
  display: flex;
  flex-direction: column;
  margin: 5rem 2rem 0 2rem;
  max-height: 14rem;

  > div {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  button {
    margin-top: 3rem;
  }

  h4 > span {
    font-size: 1rem;
  }
`;

const SEmptyCart = styled(motion.div)`
  position: absolute;
  top: 0;
  transform: translate(-50%, 0%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  h1 {
    font-size: 2rem;
    padding: 2rem;
  }

  svg {
    font-size: 10rem;
    color: var(--secondary);
  }
`;
