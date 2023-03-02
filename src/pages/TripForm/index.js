import axios from "axios";
import React, { useEffect, useState } from "react";
import { Row } from "reactstrap";
import CustomForm from "../../components/Custome/CustomForm";
import useHttp from "../../components/Hook/Use-http";
import CONSTANT, { authToken } from "../Utility/constnt";
import notify from "../Utility/coustemFunction";

const TripForm = () => {
  const [flag, setFlag] = useState(true);
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
    const URL = {
      endpoint: `/location/consentApi/${DriverID?.mobile}`,
      type: "GET",
    }
    API_CALL.sendRequest(URL, consentDataHandler);
  };

  const consentDataHandler = (res) => {
    console.log(res)
    if (res?.data?.Consent?.status === 'PENDING') {
      notify.warning(res?.data?.Consent?.status)
    }
    else if (res?.data?.Consent?.status === 'ALLOWED') {
      notify.success(res?.data?.Consent?.status)
    }
    else {
      notify.error('Get Not Status')
    }

  }

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
