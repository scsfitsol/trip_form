import axios from "axios";
import React, { useEffect, useState } from "react";
import { Row } from "reactstrap";
import CustomForm from "../../components/Custome/CustomForm";
import useHttp from "../../components/Hook/Use-http";
import CONSTANT, { authtoken } from "../Utility/constnt";

const TripForm = () => {
  const [actionData, setActionData] = useState({});
  const [flag, setFlag] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [plantData, setPlantData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [vehiclesData, setVehiclesData] = useState([]);
  const API_CALL = useHttp();

  useEffect(() => {
    (async () => {
      API_CALL.sendRequest(CONSTANT.API.getAllVehicle, vehiclesDataHandler);
      API_CALL.sendRequest(CONSTANT.API.getAllPlant, plantDataHandler);
      API_CALL.sendRequest(CONSTANT.API.getAllDriver, driverDataHandler);
    })();
  }, [flag]);

  const vehiclesDataHandler = (res) => {
    setVehiclesData(res?.data);
  };
  const plantDataHandler = (res) => {
    setPlantData(res?.data);
  };
  const driverDataHandler = (res) => {
    setDriverData(res?.data);
  };

  const onSubmitForm = (payload) => {
    (async () => {
      const ClientData = plantData.filter((e) => e.id === payload?.plantId);
      const TransporterData = vehiclesData.filter(
        (e) => e.id === payload?.vehicleId
      );
      payload.clientId = ClientData[0]?.client?.id;
      payload.transporterId = TransporterData[0]?.transporter?.id;
      console.log("payload", payload);
      API_CALL.sendRequest(
        CONSTANT.API.addTrip,
        () => setFlag((previous) => !previous),
        payload,
        "Trip Add Successfully"
      );
    })();
  };

  const onDriverChange = (DriverID) => {
    (async () => {
      try {
        if (authtoken.token == "") {
          // const response = await fetch(
          //   "https://api.allorigins.win/raw?url=https://india-agw.telenity.com/oauth/token?grant_type=client_credentials",
          //   {
          //     method: "POST", // *GET, POST, PUT, DELETE, etc.
          //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          //     credentials: "same-origin", // include, *same-origin, omit
          //     headers: {
          //       Authorization: `Basic c21hcnR0cmFpbGNsb3VkOnNtYXJ0dHJhaWxjbG91ZA==`,
          //     },
          //     redirect: "follow", // manual, *follow, error
          //     referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          //     body: JSON.stringify({}), // body data type must match "Content-Type" header
          //   }
          // );
          // console.log(response.json());
        }

        const Services = axios.create({
          baseURL:
            "https://api.allorigins.win/raw?url=https://india-agw.telenity.com",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/x-www-form-urlencoded",
            Host: "india-agw.telenity.com",
            Authorization: `Basic c21hcnR0cmFpbGNsb3VkOnNtYXJ0dHJhaWxjbG91ZA==`,
          },
        });
        const res = await Services.post(
          "/oauth/token?grant_type=client_credentials",
          {}
        );
        console.log(res);
        // } else {
        // }
        // const Services = axios.create({
        //   baseURL: "https://india-agw.telenity.com",
        //   headers: {
        //     Accept: "application/json",
        //     Authorization: `Bearer ${localStorage.getItem("authUser")}`,
        //   },
        // });
        // await Services.get(
        //   "/apigw/NOFBconsent/v1/NOFBconsent?address=tel:+91" + DriverID?.mobile
        // );
      } catch (error) {
        console.log(error?.response);
        if (error?.response?.status === 404) {
          console.log("res");
        }
      }
    })();
  };

  return (
    <React.Fragment>
      <div className="">
        <Row>
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="page-title mb-0 font-size-18">Trip</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">
                    Welcome to Fitsol Dashboard
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </Row>
        <Row className="">
          <CustomForm
            data={CONSTANT.FORM_FIELDS.TRIP}
            onSubmit={(data) => onSubmitForm(data)}
            defaultData={""}
            formData={false}
            option={{
              vehicleId: vehiclesData.map((data) => {
                return { label: data.registrationNumber, value: data.id };
              }),
              plantId: plantData.map((data) => {
                return { label: data.unitName, value: data.id };
              }),
              driverId: driverData.map((data) => {
                return {
                  label: data.name,
                  value: data.id,
                  mobile: data.mobile,
                };
              }),
            }}
            onChangeFunction={{ driverId: onDriverChange }}
            // isEdit={isEdit}
          />
        </Row>
      </div>
    </React.Fragment>
  );
};

export default TripForm;
