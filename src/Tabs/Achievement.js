import React, { useState, useEffect } from 'react';
import { Input, Button, Tab } from 'semantic-ui-react';
import axios from './../Helpers/Axios';

const AchievementSchema = { line: "" }

const Achievement = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shouldUpdate, setshouldUpdate] = useState(false);
    const [newData, setnewData] = useState({ ...AchievementSchema });

    useEffect(() => {
        axios.get("/api/achievement/")
            .then((res) => {
                console.log(res.data);
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
    }, [shouldUpdate]);

    const onChangeHandler = (event, index) => {
        const prevState = [...data];
        prevState[index].line = event.target.value;
        prevState[index].changed = prevState[index].line !== "";
        setData(prevState);
    }

    const onNewDataChangeHandler = (e) => {
        const prevData = { ...newData };
        prevData.line = e.target.value;
        prevData.changed = prevData.line !== "";
        setnewData(prevData);
    }
    const onNewAchievementClickHandler = async (e) => {
        e.currentTarget.classList.add("loading");
        const response = await axios.post("/api/achievement/", {
            line: newData.line
        });
        console.log(response);
        setnewData({ ...AchievementSchema });
        setshouldUpdate(prevData => !prevData);
    }
    const handleUpdateClickHandler = async (event, index) => {
        event.currentTarget.classList.add("loading");
        const response = await axios.put("/api/achievement", {
            id: data[index]._id,
            line: data[index].line,
        });
        console.log(response);
        setshouldUpdate(prevState => !prevState);
    }

    const handleDeleteClickHandler = async (e, index) => {
        e.currentTarget.classList.add("loading");
        const response = axios.delete("/api/achievement/", {
            data: {
                id: data[index]._id,
            }
        });
        console.log(response);
        setshouldUpdate(prevState => !prevState);
    }

    return (
        <Tab.Pane loading={Boolean(loading)}>
            {
                data.map((vals, index) => (
                    <div style={{ display: 'flex' }} key={vals._id}>
                        <Input
                            placeholder="Enter Your Achievement..."
                            style={{ flexGrow: 1, margin: '0.5%' }}
                            value={vals.line}
                            onChange={(event) => { onChangeHandler(event, index) }} />
                        <Button
                            color={vals.changed ? "green" : "grey"}
                            disabled={vals.changed ? false : true}
                            style={{ alignSelf: 'center', minWidth: "5%", margin: '0.5%' }}
                            content='Update'
                            onClick={(event) => { handleUpdateClickHandler(event, index) }}
                        />
                        <Button
                            color="red"
                            style={{ alignSelf: 'center', minWidth: "5%", margin: '0.5%' }}
                            content='Delete'
                            onClick={(event) => { handleDeleteClickHandler(event, index) }}
                        />
                    </div>
                ))
            }
            <div style={{ display: 'flex' }}>
                <Input
                    placeholder="Enter Skill"
                    style={{ flexGrow: 1, margin: '0.5%' }}
                    value={newData.line}
                    onChange={(event) => { onNewDataChangeHandler(event) }} />
                <Button
                    style={{ alignSelf: 'center', minWidth: "11%", margin: "0.5%" }}
                    content='Add'
                    color={newData.changed ? "green" : "grey"}
                    disabled={newData.changed ? false : true}
                    onClick={(event) => { onNewAchievementClickHandler(event) }}
                />
            </div>
        </Tab.Pane>
    )
}

export default Achievement
