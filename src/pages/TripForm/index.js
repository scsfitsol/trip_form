import React, { useEffect, useState } from 'react'
import { Row } from 'reactstrap'
import CustomForm from '../../components/Custome/CustomForm'
import useHttp from '../../components/Hook/Use-http'
import CONSTANT from '../Utility/constnt'


const TripForm = () => {
  const [actionData, setActionData] = useState({});
  const [flag, setFlag] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [plantData, setPlantData] = useState([]);
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
    CONSTANT.FORM_FIELDS.TRIP.push({
      name: "vehicleId",
      label: "Vehicle Name",
      placeholder: "Vehicle Name",
      type: "SingleSelect",
      options: res?.data.map((data) => {
        return { label: data.registrationNumber, value: data.id };
      }),
    });
  };
  const plantDataHandler = (res) => {
    setPlantData(res?.data);
    CONSTANT.FORM_FIELDS.TRIP.push({
      name: "plantId",
      label: "Plant Name",
      placeholder: "Plant Name",
      type: "SingleSelect",
      options: res?.data.map((data) => {
        return { label: data.unitName, value: data.id };
      }),
    });
  };
  const driverDataHandler = (res) => {
    CONSTANT.FORM_FIELDS.TRIP.push({
      name: "driverId",
      label: "Driver Name",
      placeholder: "Driver Name",
      type: "SingleSelect",
      options: res?.data.map((data) => {
        return { label: data.name, value: data.id };
      }),
    });
  };


  const onSubmitForm = (payload) => {
    (async () => {
      const ClientData = plantData.filter((e) => e.id === payload?.plantId);
      const TransporterData = vehiclesData.filter(
        (e) => e.id === payload?.vehicleId
      );
      payload.clientId = ClientData[0]?.client?.id;
      payload.transporterId = TransporterData[0]?.transporter?.id;

      API_CALL.sendRequest(
        CONSTANT.API.addTrip,
        () => setFlag((previous) => !previous),
        payload,
        "Trip Add Successfully"
      );
    })()
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
        <Row className=''>
          <CustomForm
            data={CONSTANT.FORM_FIELDS.TRIP}
            onSubmit={(data) => onSubmitForm(data)}
            defaultData={""}
            formData={false}
          // isEdit={isEdit}
          />
        </Row>
      </div >
    </React.Fragment >
  )
}

export default TripForm