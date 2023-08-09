import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import "./Form.css";
import { addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);
const db = getFirestore();
const collectionRef = collection(db, "users");

const Form = ({ setUsers }) => {
  const methods = useForm();
  const { register, handleSubmit, setValue } = methods;

  const countryOptions = [
    { value: "usa", label: "USA" },
    { value: "canada", label: "Canada" },
  ];

  const usaCities = [
    { value: "lasVegas", label: "Las Vegas" },
    { value: "chicago", label: "Chicago" },
  ];

  const canadianCities = [
    { value: "ottawa", label: "Ottawa" },
    { value: "toronto", label: "Toronto" },
  ];

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [citiesOptions, setCitiesOptions] = useState([]);

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);

    // Update the cities options based on the selected country
    if (selectedOption.value === "usa") {
      setCitiesOptions(usaCities);
    } else if (selectedOption.value === "canada") {
      setCitiesOptions(canadianCities);
    } else {
      setCitiesOptions([]);
    }

    setValue("country", selectedOption);
  };

  const handleSubmitForm = async (data) => {
    try {
      const validatedData = {
        fullName: data.fullName || "",
        dob: data.dob || "",
        city: data.city?.label || "",
        country: selectedCountry.label || "",
      };

      const docRef = await addDoc(collectionRef, validatedData);
      setUsers((prevUsers) => [
        ...prevUsers,
        {
          id: docRef.id,
          ...validatedData,
        },
      ]);
      methods.reset();
    } catch (error) {
      console.error("Error adding user to Firestore: ", error);
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit(handleSubmitForm)}>
        <input
          className="input-field"
          {...register("fullName", { required: true })}
          placeholder="Full Name"
        />
        <input
          type="date"
          className="input-field"
          {...register("dob", { required: true })}
          placeholder="Date of Birth"
        />
        <Select
          className="select-field"
          name="country"
          options={countryOptions}
          onChange={handleCountryChange}
          value={selectedCountry}
        />
        <Controller
          control={methods.control}
          name="city"
          render={({ field: { onChange, value, name, ref } }) => (
            <Select
              ref={ref}
              name={name}
              className="select-field"
              options={citiesOptions}
              onChange={(selectedOption) => {
                onChange(selectedOption);
              }}
              value={value}
            />
          )}
        />

        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
