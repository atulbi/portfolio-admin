import React, { useState, useEffect } from 'react';
import { Input, Button, Tab } from 'semantic-ui-react';
import axios from './../Helpers/Axios';

const types = ["Fundamentals", "Skills", "Tools", "Additional"]
const newSchema = { data: "", rating: '' }

const Ability = (props) => {
    const [data, setdata] = useState({ "Fundamentals": [], "Skills": [], "Tools": [], "Additional": [] });
    const [newdata, setnewdata] = useState({ "Fundamentals": { ...newSchema }, "Skills": { ...newSchema }, "Tools": { ...newSchema }, "Additional": { ...newSchema } });
    const [loading, setLoading] = useState(1);
    const [shouldDataUpdate, setshouldDataUpdate] = useState(true);

    // Initial Fetch Effect
    useEffect(() => {
        const api = async () => ({
            "Fundamentals": (await axios.get("/api/ability?abilityType=fundamentals")).data,
            "Skills": (await axios.get("/api/ability?abilityType=skills")).data,
            "Tools": (await axios.get("/api/ability?abilityType=tools")).data,
            "Additional": (await axios.get("/api/ability?abilityType=additional")).data
        })
        api().then((abilityData) => {
            console.log(abilityData);
            setdata(abilityData)
            setLoading(false);
        });
    }, [shouldDataUpdate]);

    const onChangeHandler = (event, type, index) => {
        const currState = { ...data };
        if (event.target.type === "text") {
            currState[type][index].data = event.target.value;
        }
        if (event.target.type === "number") {
            currState[type][index].rating = event.target.value;
        }
        currState[type][index].changed = currState[type][index].data !== "" && currState[type][index].rating <= 5 && currState[type][index].rating >= 1;
        setdata(currState);
    }

    const handleUpdateClickHandler = async (event, type, index) => {
        event.currentTarget.classList.add("loading");
        const response = await axios.put("/api/ability", {
            id: data[type][index]._id,
            data: data[type][index].data,
            rating: data[type][index].rating
        });
        setshouldDataUpdate(prevState => !prevState);
        console.log(response)
    }

    const handleDeleteClickHandler = async (event, type, index) => {
        event.currentTarget.classList.add("loading");
        const response = await axios.delete("/api/ability", {
            data: {
                id: data[type][index]._id,
            }
        });
        setshouldDataUpdate(prevState => !prevState);
        console.log(response)
    }

    const onNewDataChangeHandler = (event, type) => {
        const currState = { ...newdata };
        if (event.target.type === "text") {
            currState[type].data = event.target.value;
        }
        if (event.target.type === "number") {
            currState[type].rating = event.target.value;
        }
        currState[type].changed = currState[type].data !== "" && currState[type].rating <= 5 && currState[type].rating >= 1;
        setnewdata(currState);
    }

    const onNewAbilityClickHandler = async (event, type) => {
        event.currentTarget.classList.add("loading");
        const response = await axios.post("/api/ability/", {
            data: newdata[type].data,
            rating: newdata[type].rating,
            abilityType: type.toLowerCase()
        });
        setshouldDataUpdate(prevState => !prevState);
        setnewdata(prevState => {
            console.log(prevState);
            prevState[type] = { ...newSchema };
            return prevState;
        })
        console.log(response);
    }


    return (
        <Tab.Pane loading={Boolean(loading)} >
            <React.Fragment >
                {types.map((type, index) => (
                    <React.Fragment key={type}>
                        <h1>{type}</h1>
                        {data[type].map((ability, index) => (
                            <div style={{ display: 'flex' }} key={ability._id}>
                                <Input
                                    style={{ flexGrow: 1, margin: '0.5%' }}
                                    value={ability.data}
                                    onChange={(event) => { onChangeHandler(event, type, index) }} />
                                <Input
                                    placeholder="Rating"
                                    type='number'
                                    min={1}
                                    max={5}
                                    style={{ flexGrow: '0.2', alignSelf: 'center', minWidth: "5%", margin: '0.5%' }}
                                    value={ability.rating}
                                    onChange={(event) => { onChangeHandler(event, type, index) }}
                                />
                                <Button
                                    color={ability.changed ? "green" : "grey"}
                                    disabled={ability.changed ? false : true}
                                    style={{ alignSelf: 'center', minWidth: "5%", margin: '0.5%' }}
                                    content='Update'
                                    onClick={(event) => { handleUpdateClickHandler(event, type, index) }}
                                />
                                <Button
                                    color="red"
                                    style={{ alignSelf: 'center', minWidth: "5%", margin: '0.5%' }}
                                    content='Delete'
                                    onClick={(event) => { handleDeleteClickHandler(event, type, index) }}
                                />
                            </div>

                        ))}
                        <div style={{ display: 'flex' }}>
                            <Input
                                placeholder="Enter Skill"
                                style={{ flexGrow: 1, margin: '0.5%' }}
                                value={newdata[type].data}
                                onChange={(event) => { onNewDataChangeHandler(event, type) }} />
                            <Input
                                placeholder="Rating"
                                type='number'
                                min={1}
                                max={5}
                                style={{ flexGrow: '0.2', alignSelf: 'center', minWidth: "5%", margin: '0.5%' }}
                                value={newdata[type].rating}
                                onChange={(event) => { onNewDataChangeHandler(event, type) }}
                            />
                            <Button
                                style={{ alignSelf: 'center', minWidth: "11%", margin: "0.5%" }}
                                content='Add'
                                color={newdata[type].changed ? "green" : "grey"}
                                disabled={newdata[type].changed ? false : true}
                                onClick={(event) => { onNewAbilityClickHandler(event, type) }}
                            />
                        </div>
                    </React.Fragment>
                ))}
            </React.Fragment>
        </Tab.Pane>

    )
}

export default React.memo(Ability)
