import React, { useMemo, useReducer, useState } from "react";

const t = (s) => (s ?? "").toString().trim();

// Luhn algorithm (optional but included)
function luhnCheck(num) {
  const digits = (num || "").replace(/\D/g, "");
  if (digits.length !== 16) return false;
  let sum = 0, dbl = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

// Mask: "#### #### #### ####"
function formatCardNumber(value) {
  return (value || "")
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

// Mask: "MM/YY"
function formatExpiry(value) {
  const v = (value || "").replace(/\D/g, "").slice(0, 4);
  if (v.length <= 2) return v;
  return `${v.slice(0, 2)}/${v.slice(2)}`;
}

function isFutureExpiry(mmYY) {
  const m = (mmYY || "").match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!m) return false;
  const month = parseInt(m[1], 10);
  const year = 2000 + parseInt(m[2], 10);
  const now = new Date();
  const thisMonth = now.getMonth() + 1;
  const thisYear = now.getFullYear();
  return year > thisYear || (year === thisYear && month >= thisMonth);
}

const validators = {
  name: (v) => {
    const s = t(v);
    if (!s) return "Name is required";
    if (s.length < 2) return "Name must be at least 2 characters";
    return "";
  },
  email: (v) => {
    const s = t(v);
    if (!s) return "Email is required";
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
    return ok ? "" : "Invalid email format";
  },
  address: (v) => {
    const s = t(v);
    if (!s) return "Address is required";
    if (s.length < 10) return "Address must be at least 10 characters";
    return "";
  },
  phone: (v) => {
    const s = (v || "").replace(/\D/g, "");
    if (s.length !== 10) return "Phone must be exactly 10 digits";
    return "";
  },
  cardNumber: (v) => {
    const s = (v || "").replace(/\D/g, "");
    if (s.length !== 16) return "Card number must be 16 digits";
    if (!luhnCheck(s)) return "Invalid card number";
    return "";
  },
  expiry: (v) => {
    const s = t(v);
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(s)) return "Use MM/YY";
    if (!isFutureExpiry(s)) return "Expiry must be a future month/year";
    return "";
  },
  cvv: (v) => {
    const s = (v || "").replace(/\D/g, "");
    if (s.length !== 3) return "CVV must be 3 digits";
    return "";
  },
};

function validateAll(values) {
  const errors = {};
  (Object.keys(validators)).forEach((k) => {
    const err = validators[k](values[k]);
    if (err) errors[k] = err;
  });
  return errors;
}


const initialValues = {
  name: "",
  email: "",
  address: "",
  phone: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

const initialTouched = Object.keys(initialValues).reduce((acc, k) => {
  acc[k] = false;
  return acc;
}, {});

function reducer(state, action) {
  switch (action.type) {
    case "CHANGE": {
      const { name, value } = action;
      const nextValues = { ...state.values, [name]: value };
      const fieldError = validators[name](value);
      const nextErrors = { ...state.errors, [name]: fieldError };
      return { ...state, values: nextValues, errors: nextErrors };
    }
    case "BLUR": {
      const { name } = action;
      return { ...state, touched: { ...state.touched, [name]: true } };
    }
    case "VALIDATE_ALL": {
      const allErrors = validateAll(state.values);
      return {
        ...state,
        errors: allErrors,
        touched: Object.keys(state.touched).reduce((acc, k) => ({ ...acc, [k]: true }), {}),
      };
    }
    case "RESET": {
      return {
        values: { ...initialValues },
        errors: validateAll(initialValues),
        touched: { ...initialTouched },
      };
    }
    default:
      return state;
  }
}


function InputField({
  label,
  name,
  placeholder,
  type = "text",
  state,
  dispatch,
  maxLength,
  inputMode = "text",
  onFormat,
}) {
  const value = state.values[name] ?? "";
  const error = state.touched[name] && state.errors[name];

  return (
    <div style={{ marginBottom: 12 }}>
      <label htmlFor={name} style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          const raw = e.target.value;
          const next = onFormat ? onFormat(raw) : raw;
          dispatch({ type: "CHANGE", name, value: next });
        }}
        onBlur={() => dispatch({ type: "BLUR", name })}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: `1px solid ${error ? "#ef4444" : "#d1d5db"}`,
          outline: "none",
          boxShadow: error ? "0 0 0 3px rgba(239,68,68,0.15)" : "none",
        }}
      />
      {error ? (
        <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{state.errors[name]}</div>
      ) : null}
    </div>
  );
}

// Simple modal
function Modal({ open, onClose, data }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 50
    }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 20, width: "100%", maxWidth: 560, boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Order Confirmed ✅</h2>
        <p style={{ color: "#6b7280", marginBottom: 16, fontSize: 14 }}>
          Here is a summary of your details (CVV hidden for security).
        </p>
        <div style={{ display: "grid", gap: 8, fontSize: 14 }}>
          <Row k="Name" v={data.name} />
          <Row k="Email" v={data.email} />
          <Row k="Phone" v={data.phone} />
          <Row k="Address" v={data.address} wrap />
          <Row k="Card" v={`**** **** **** ${data.cardNumber.replace(/\D/g, "").slice(-4)}`} />
          <Row k="Expiry" v={data.expiry} />
        </div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose}
            style={{ background: "#4f46e5", color: "#fff", padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
function Row({ k, v, wrap }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <span style={{ color: "#6b7280" }}>{k}</span>
      <span style={{ textAlign: "right", ...(wrap ? { maxWidth: "65%" } : {}) }}>{v}</span>
    </div>
  );
}




export default function CheckoutForm() {
  const [state, dispatch] = useReducer(reducer, {
    values: { ...initialValues },
    errors: validateAll(initialValues),
    touched: { ...initialTouched },
  });

  const [showModal, setShowModal] = useState(false);



  const isValid = useMemo(() => {
    const errs = Object.values(state.errors || {});
    return errs.every((e) => !e);
  }, [state.errors]);

  function handleSubmit(e) {
    e.preventDefault();
    // mark all touched & validate
    dispatch({ type: "VALIDATE_ALL" });
    if (!isValid) return;
    // success
    setShowModal(true);
  }

  return (
    <div style={{ maxWidth: 560, margin: "32px auto", padding: 20, background: "#fff", borderRadius: 16, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Checkout Form</h1>

      <form onSubmit={handleSubmit} noValidate>
        <InputField
          label="Name"
          name="name"
          placeholder="John Doe"
          state={state}
          dispatch={dispatch}
        />

        <InputField
          label="Email"
          name="email"
          placeholder="user@example.com"
          state={state}
          dispatch={dispatch}
          inputMode="email"
        />

        <InputField
          label="Address"
          name="address"
          placeholder="123, Market Street, City"
          state={state}
          dispatch={dispatch}
        />

        <InputField
          label="Phone Number"
          name="phone"
          placeholder="10-digit number"
          state={state}
          dispatch={dispatch}
          inputMode="numeric"
          onFormat={(v) => v.replace(/\D/g, "").slice(0, 10)}
          maxLength={10}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
          <InputField
            label="Card Number"
            name="cardNumber"
            placeholder="#### #### #### ####"
            state={state}
            dispatch={dispatch}
            inputMode="numeric"
            onFormat={formatCardNumber}
            maxLength={19} // 16 digits + 3 spaces
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <InputField
              label="Expiry (MM/YY)"
              name="expiry"
              placeholder="MM/YY"
              state={state}
              dispatch={dispatch}
              inputMode="numeric"
              onFormat={formatExpiry}
              maxLength={5}
            />
            <InputField
              label="CVV"
              name="cvv"
              placeholder="***"
              type="password"
              state={state}
              dispatch={dispatch}
              inputMode="numeric"
              onFormat={(v) => v.replace(/\D/g, "").slice(0, 3)}
              maxLength={3}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          style={{
            width: "100%",
            marginTop: 16,
            padding: "12px 14px",
            borderRadius: 10,
            border: "none",
            color: "#fff",
            background: isValid ? "#1f2937" : "#9ca3af",
            cursor: isValid ? "pointer" : "not-allowed",
          }}
        >
          Submit
        </button>
      </form>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        data={state.values}
      />
    </div>
  );
}
