import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation
import './InspectionPage.css'; // Assuming you have the CSS file


const InspectionPage = ({ vehicleId }) => {
    const [inspectionData, setInspectionData] = useState({
        tires: {
            leftFront: '',
            rightFront: '',
            leftRear: '',
            rightRear: '',
        },
        battery: {
            make: '',
            replacementDate: '',
            voltage: '',
            waterLevel: '',
            damage: false,
            leak: false,
        },
        exterior: {
            rust: false,
            dent: false,
            damage: false,
            damageNotes: '',
            suspensionOilLeak: false,
            images: [],
        },
        brakes: {
            fluidLevel: '',
            frontCondition: '',
            rearCondition: '',
            emergencyBrakeCondition: '',
            overallSummary: '',
        },
        engine: {
            rust: false,
            dent: false,
            damage: false,
            oilCondition: '',
            oilColor: '',
            brakeFluidCondition: '',
            brakeFluidColor: '',
            oilLeak: false,
        },
    });


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('en'); // Language selection state
    const [summary, setSummary] = useState('');


    useEffect(() => {
        const fetchInspectionData = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/inspections/vehicle/${vehicleId}`);
                setInspectionData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Error fetching inspection data.');
                setLoading(false);
            }
        };


        fetchInspectionData();
    }, [vehicleId]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;


        // Update inspection data based on input type
        if (type === 'checkbox') {
            const keys = name.split('.');
            setInspectionData(prevData => {
                const updatedData = { ...prevData };
                keys.reduce((acc, key, index) => {
                    if (index === keys.length - 1) {
                        acc[key] = checked;
                    } else {
                        acc[key] = { ...acc[key] };
                    }
                    return acc[key];
                }, updatedData);
                return updatedData;
            });
        } else if (type === 'file') {
            const files = e.target.files;
            const imagesArray = Array.from(files).map(file => URL.createObjectURL(file));
            setInspectionData(prevData => ({
                ...prevData,
                exterior: {
                    ...prevData.exterior,
                    images: [...prevData.exterior.images, ...imagesArray],
                },
            }));
        } else {
            const keys = name.split('.');
            setInspectionData(prevData => {
                const updatedData = { ...prevData };
                keys.reduce((acc, key, index) => {
                    if (index === keys.length - 1) {
                        acc[key] = value;
                    } else {
                        acc[key] = { ...acc[key] };
                    }
                    return acc[key];
                }, updatedData);
                return updatedData;
            });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5001/api/inspections/vehicle/${vehicleId}`, inspectionData);


            if (response.status === 200) {
                alert('Inspection data updated successfully!');
                const updatedResponse = await axios.get(`http://localhost:5001/api/inspections/vehicle/${vehicleId}`);
                setInspectionData(updatedResponse.data); // Update the local state with the latest data
            }
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error updating inspection data.');
        }
    };


    // Function to generate summary based on the selected language
    const generateSummary = () => {
        let summaryText = '';


        if (selectedLanguage === 'en') {
            summaryText = `
            Vehicle Inspection Summary
            ---------------------------
            Tires:
            Left Front: ${inspectionData.tires.leftFront}
            Right Front: ${inspectionData.tires.rightFront}
            Left Rear: ${inspectionData.tires.leftRear}
            Right Rear: ${inspectionData.tires.rightRear}
           
            Battery:
            Make: ${inspectionData.battery.make}
            Replacement Date: ${inspectionData.battery.replacementDate}
            Voltage: ${inspectionData.battery.voltage}
            Water Level: ${inspectionData.battery.waterLevel}
            Damage: ${inspectionData.battery.damage ? 'Yes' : 'No'}
            Leak: ${inspectionData.battery.leak ? 'Yes' : 'No'}


            Exterior:
            Rust: ${inspectionData.exterior.rust ? 'Yes' : 'No'}
            Dent: ${inspectionData.exterior.dent ? 'Yes' : 'No'}
            Damage: ${inspectionData.exterior.damage ? 'Yes' : 'No'}
            Damage Notes: ${inspectionData.exterior.damageNotes}
            Suspension Oil Leak: ${inspectionData.exterior.suspensionOilLeak ? 'Yes' : 'No'}


            Brakes:
            Fluid Level: ${inspectionData.brakes.fluidLevel}
            Front Condition: ${inspectionData.brakes.frontCondition}
            Rear Condition: ${inspectionData.brakes.rearCondition}
            Emergency Brake Condition: ${inspectionData.brakes.emergencyBrakeCondition}
            Overall Summary: ${inspectionData.brakes.overallSummary}


            Engine:
            Rust: ${inspectionData.engine.rust ? 'Yes' : 'No'}
            Dent: ${inspectionData.engine.dent ? 'Yes' : 'No'}
            Damage: ${inspectionData.engine.damage ? 'Yes' : 'No'}
            Oil Condition: ${inspectionData.engine.oilCondition}
            Oil Color: ${inspectionData.engine.oilColor}
            Brake Fluid Condition: ${inspectionData.engine.brakeFluidCondition}
            Brake Fluid Color: ${inspectionData.engine.brakeFluidColor}
            Oil Leak: ${inspectionData.engine.oilLeak ? 'Yes' : 'No'}
            `;
        } else if (selectedLanguage === 'es') { // Spanish example
            summaryText = `
            Resumen de Inspección del Vehículo
            ---------------------------
            Neumáticos:
            Izquierdo Frontal: ${inspectionData.tires.leftFront}
            Derecho Frontal: ${inspectionData.tires.rightFront}
            Izquierdo Trasero: ${inspectionData.tires.leftRear}
            Derecho Trasero: ${inspectionData.tires.rightRear}
           
            Batería:
            Marca: ${inspectionData.battery.make}
            Fecha de Reemplazo: ${inspectionData.battery.replacementDate}
            Voltaje: ${inspectionData.battery.voltage}
            Nivel de Agua: ${inspectionData.battery.waterLevel}
            Daño: ${inspectionData.battery.damage ? 'Sí' : 'No'}
            Fuga: ${inspectionData.battery.leak ? 'Sí' : 'No'}


            Exterior:
            Óxido: ${inspectionData.exterior.rust ? 'Sí' : 'No'}
            Abolladura: ${inspectionData.exterior.dent ? 'Sí' : 'No'}
            Daño: ${inspectionData.exterior.damage ? 'Sí' : 'No'}
            Notas de Daño: ${inspectionData.exterior.damageNotes}
            Fuga de Aceite de Suspensión: ${inspectionData.exterior.suspensionOilLeak ? 'Sí' : 'No'}


            Frenos:
            Nivel de Fluido: ${inspectionData.brakes.fluidLevel}
            Condición Frontal: ${inspectionData.brakes.frontCondition}
            Condición Trasera: ${inspectionData.brakes.rearCondition}
            Condición del Freno de Emergencia: ${inspectionData.brakes.emergencyBrakeCondition}
            Resumen General: ${inspectionData.brakes.overallSummary}


            Motor:
            Óxido: ${inspectionData.engine.rust ? 'Sí' : 'No'}
            Abolladura: ${inspectionData.engine.dent ? 'Sí' : 'No'}
            Daño: ${inspectionData.engine.damage ? 'Sí' : 'No'}
            Condición del Aceite: ${inspectionData.engine.oilCondition}
            Color del Aceite: ${inspectionData.engine.oilColor}
            Condición del Fluido de Frenos: ${inspectionData.engine.brakeFluidCondition}
            Color del Fluido de Frenos: ${inspectionData.engine.brakeFluidColor}
            Fuga de Aceite: ${inspectionData.engine.oilLeak ? 'Sí' : 'No'}
            `;
        }


        setSummary(summaryText);
    };


    // Function to create and download the PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text(summary, 10, 10);
        doc.save('inspection-summary.pdf'); // Save the PDF
    };


    // Generate summary when the inspection data changes
    useEffect(() => {
        generateSummary();
    }, [inspectionData, selectedLanguage]);


    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;


    return (
        <form className="inspection-page" onSubmit={handleSubmit}>
            <h1>Vehicle Inspection</h1>


            <h2>Tires</h2>
            <label>Left Front:
                <input
                    type="text"
                    name="tires.leftFront"
                    value={inspectionData.tires.leftFront}
                    onChange={handleChange}
                />
            </label>
            <label>Right Front:
                <input
                    type="text"
                    name="tires.rightFront"
                    value={inspectionData.tires.rightFront}
                    onChange={handleChange}
                />
            </label>
            <label>Left Rear:
                <input
                    type="text"
                    name="tires.leftRear"
                    value={inspectionData.tires.leftRear}
                    onChange={handleChange}
                />
            </label>
            <label>Right Rear:
                <input
                    type="text"
                    name="tires.rightRear"
                    value={inspectionData.tires.rightRear}
                    onChange={handleChange}
                />
            </label>


            <h2>Battery</h2>
            <label>Make:
                <input
                    type="text"
                    name="battery.make"
                    value={inspectionData.battery.make}
                    onChange={handleChange}
                />
            </label>
            <label>Replacement Date:
                <input
                    type="date"
                    name="battery.replacementDate"
                    value={inspectionData.battery.replacementDate}
                    onChange={handleChange}
                />
            </label>
            <label>Voltage:
                <input
                    type="text"
                    name="battery.voltage"
                    value={inspectionData.battery.voltage}
                    onChange={handleChange}
                />
            </label>
            <label>Water Level:
                <input
                    type="text"
                    name="battery.waterLevel"
                    value={inspectionData.battery.waterLevel}
                    onChange={handleChange}
                />
            </label>
            <label>Damage:
                <input
                    type="checkbox"
                    name="battery.damage"
                    checked={inspectionData.battery.damage}
                    onChange={handleChange}
                />
            </label>
            <label>Leak:
                <input
                    type="checkbox"
                    name="battery.leak"
                    checked={inspectionData.battery.leak}
                    onChange={handleChange}
                />
            </label>


            <h2>Exterior</h2>
            <label>Rust:
                <input
                    type="checkbox"
                    name="exterior.rust"
                    checked={inspectionData.exterior.rust}
                    onChange={handleChange}
                />
            </label>
            <label>Dent:
                <input
                    type="checkbox"
                    name="exterior.dent"
                    checked={inspectionData.exterior.dent}
                    onChange={handleChange}
                />
            </label>
            <label>Damage:
                <input
                    type="checkbox"
                    name="exterior.damage"
                    checked={inspectionData.exterior.damage}
                    onChange={handleChange}
                />
            </label>
            <label>Damage Notes:
                <input
                    type="text"
                    name="exterior.damageNotes"
                    value={inspectionData.exterior.damageNotes}
                    onChange={handleChange}
                />
            </label>
            <label>Suspension Oil Leak:
                <input
                    type="checkbox"
                    name="exterior.suspensionOilLeak"
                    checked={inspectionData.exterior.suspensionOilLeak}
                    onChange={handleChange}
                />
            </label>
            <label>Images:
                <input
                    type="file"
                    multiple
                    onChange={handleChange}
                />
                <div className="image-preview">
                    {inspectionData.exterior.images.map((img, index) => (
                        <img key={index} src={img} alt="Inspection" />
                    ))}
                </div>
            </label>


            <h2>Brakes</h2>
            <label>Fluid Level:
                <input
                    type="text"
                    name="brakes.fluidLevel"
                    value={inspectionData.brakes.fluidLevel}
                    onChange={handleChange}
                />
            </label>
            <label>Front Condition:
                <input
                    type="text"
                    name="brakes.frontCondition"
                    value={inspectionData.brakes.frontCondition}
                    onChange={handleChange}
                />
            </label>
            <label>Rear Condition:
                <input
                    type="text"
                    name="brakes.rearCondition"
                    value={inspectionData.brakes.rearCondition}
                    onChange={handleChange}
                />
            </label>
            <label>Emergency Brake Condition:
                <input
                    type="text"
                    name="brakes.emergencyBrakeCondition"
                    value={inspectionData.brakes.emergencyBrakeCondition}
                    onChange={handleChange}
                />
            </label>
            <label>Overall Summary:
                <input
                    type="text"
                    name="brakes.overallSummary"
                    value={inspectionData.brakes.overallSummary}
                    onChange={handleChange}
                />
            </label>


            <h2>Engine</h2>
            <label>Rust:
                <input
                    type="checkbox"
                    name="engine.rust"
                    checked={inspectionData.engine.rust}
                    onChange={handleChange}
                />
            </label>
            <label>Dent:
                <input
                    type="checkbox"
                    name="engine.dent"
                    checked={inspectionData.engine.dent}
                    onChange={handleChange}
                />
            </label>
            <label>Damage:
                <input
                    type="checkbox"
                    name="engine.damage"
                    checked={inspectionData.engine.damage}
                    onChange={handleChange}
                />
            </label>
            <label>Oil Condition:
                <input
                    type="text"
                    name="engine.oilCondition"
                    value={inspectionData.engine.oilCondition}
                    onChange={handleChange}
                />
            </label>
            <label>Oil Color:
                <input
                    type="text"
                    name="engine.oilColor"
                    value={inspectionData.engine.oilColor}
                    onChange={handleChange}
                />
            </label>
            <label>Brake Fluid Condition:
                <input
                    type="text"
                    name="engine.brakeFluidCondition"
                    value={inspectionData.engine.brakeFluidCondition}
                    onChange={handleChange}
                />
            </label>
            <label>Brake Fluid Color:
                <input
                    type="text"
                    name="engine.brakeFluidColor"
                    value={inspectionData.engine.brakeFluidColor}
                    onChange={handleChange}
                />
            </label>
            <label>Oil Leak:
                <input
                    type="checkbox"
                    name="engine.oilLeak"
                    checked={inspectionData.engine.oilLeak}
                    onChange={handleChange}
                />
            </label>


            <button type="submit">Submit Inspection</button>
            <button type="button" onClick={downloadPDF}>Download Summary PDF</button>


            <div className="summary">
                <h2>Inspection Summary</h2>
                <pre>{summary}</pre>
            </div>
        </form>
    );
};


export default InspectionPage;
