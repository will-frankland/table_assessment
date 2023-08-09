import React, { useState, useEffect } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";

//MUI
import TextField from "@mui/material/TextField";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import "./Table.css";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
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

const Table = ({ users, setUsers }) => {
  const [rowIndex, setRowIndex] = useState(-1);
  const [columnIndex, setColumnIndex] = useState(-1);

  useEffect(() => {
    const fetchUsersFromFirestore = async () => {
      try {
        const snapshot = await getDocs(collectionRef);
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users from Firestore: ", error);
      }
    };

    fetchUsersFromFirestore();
  }, [setUsers]);

  const handleDeleteRow = async (userId) => {
    try {
      // Delete the user data from Firestore
      await deleteDoc(doc(db, "users", userId));

      // Remove the user from the frontend state
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user from Firestore: ", error);
    }
  };

  const handleTextFieldChange = async (rowInd, colName, value) => {
    try {
      const updatedUserData = { [colName]: value };
      await updateDoc(doc(db, "users", users[rowInd].id), updatedUserData);

      const updatedUsers = [...users];
      updatedUsers[rowInd] = { ...updatedUsers[rowInd], [colName]: value };
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating user in Firestore: ", error);
    }
  };

  const handleExit = () => {
    setRowIndex(-1);
    setColumnIndex(-1);
  };

  return (
    <div className="table-container">
      <CTable>
        <CTableHead className="table__header">
          <CTableRow className="table__row">
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Date of Birth</CTableHeaderCell>
            <CTableHeaderCell scope="col">Country</CTableHeaderCell>
            <CTableHeaderCell scope="col">City</CTableHeaderCell>
            <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <ClickAwayListener onClickAway={() => handleExit()}>
          <CTableBody className="table__body">
            {users.map((user, idx) => (
              <CTableRow className="table__row">
                <CTableDataCell
                  onClick={() => {
                    setRowIndex(idx);
                    setColumnIndex(0);
                  }}
                >
                  {rowIndex === idx && columnIndex === 0 ? (
                    <TextField
                      defaultValue={user.fullName}
                      onChange={(event) =>
                        handleTextFieldChange(
                          idx,
                          "fullName",
                          event.target.value
                        )
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleExit();
                        }
                      }}
                      id="standard-basic"
                      variant="standard"
                    />
                  ) : (
                    user.fullName
                  )}
                </CTableDataCell>
                <CTableDataCell
                  onClick={() => {
                    setRowIndex(idx);
                    setColumnIndex(1);
                  }}
                >
                  {rowIndex === idx && columnIndex === 1 ? (
                    <TextField
                      defaultValue={user.dob}
                      onChange={(event) =>
                        handleTextFieldChange(idx, "dob", event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleExit();
                        }
                      }}
                      id="standard-basic"
                      variant="standard"
                    />
                  ) : (
                    new Date(user.dob).toLocaleDateString()
                  )}
                </CTableDataCell>
                <CTableDataCell
                  onClick={() => {
                    setRowIndex(idx);
                    setColumnIndex(2);
                  }}
                >
                  {rowIndex === idx && columnIndex === 2 ? (
                    <TextField
                      defaultValue={user.country}
                      onChange={(event) =>
                        handleTextFieldChange(
                          idx,
                          "country",
                          event.target.value
                        )
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleExit();
                        }
                      }}
                      id="standard-basic"
                      variant="standard"
                    />
                  ) : (
                    user.country
                  )}
                </CTableDataCell>
                <CTableDataCell
                  onClick={() => {
                    setRowIndex(idx);
                    setColumnIndex(3);
                  }}
                >
                  {rowIndex === idx && columnIndex === 3 ? (
                    <TextField
                      defaultValue={user.city}
                      onChange={(event) =>
                        handleTextFieldChange(idx, "city", event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleExit();
                        }
                      }}
                      id="standard-basic"
                      variant="standard"
                    />
                  ) : (
                    user.city
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  <div className="actions">
                    <BsFillTrashFill
                      className="delete__btn"
                      onClick={() => handleDeleteRow(user.id)}
                    />
                    <BsFillPencilFill className="edit__btn" />
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </ClickAwayListener>
      </CTable>
    </div>
  );
};

export default Table;
