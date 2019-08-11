import React, { useState, useEffect } from 'react';
import { Form, Accordion, Icon, Input, Button, Tab } from 'semantic-ui-react';
import axios from './../Helpers/Axios';

const jobSchema = { company: "", typeOfJob: "", duration: "", description: [] };

const Job = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [activeIndex, setactiveIndex] = useState(-1);
    const [shouldUpdate, setShouldUpdate] = useState(true);
    const [newLine, setnewLine] = useState("")
    const [newData, setnewData] = useState({ ...jobSchema });

    const accordionClickHandler = (e, index) => {
        if (activeIndex === index) {
            setactiveIndex(-1);
        } else {
            setactiveIndex(index);
        }
    }

    useEffect(() => {
        axios.get("/api/job/")
            .then((res) => {
                console.log(res);
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })

    }, [shouldUpdate]);
    const checkValidation = (index) => {
        let thisData;
        if (index === -1) {
            thisData = { ...newData };
        } else {
            thisData = data[index];
        }
        let emptyStrCheck = true;
        for (let x of thisData.description) {
            emptyStrCheck = emptyStrCheck && x !== "";
        }
        return thisData.company !== "" &&
            thisData.typeOfJob !== "" &&
            thisData.duration !== "" &&
            thisData.description.length !== 0 && emptyStrCheck;
    }
    const onChangeHandler = (event, index, type) => {
        let thisData;
        if (index === -1) {
            thisData = { ...newData };
        } else {
            thisData = [...data];
        }
        if (index === -1) {
            thisData[type] = event.target.value;
            thisData.changed = checkValidation(index);
            setnewData(thisData);
        } else {
            thisData[index][type] = event.target.value;
            thisData[index].changed = checkValidation(index);
            setData(thisData);
        }
    }
    const onLinesChangeHandler = (event, index, lineIndex, type) => {
        let thisData;
        if (index === -1) {
            thisData = { ...newData };
        } else {
            thisData = [...data];
        }
        if (index === -1) {
            thisData[type][lineIndex] = event.target.value;
            thisData.changed = checkValidation(index);
            setnewData(thisData);
        } else {
            thisData[index][type][lineIndex] = event.target.value;
            thisData[index].changed = checkValidation(index);
            setData(thisData);
        }
    }
    const onClickOnAddHandler = (index, type) => {
        let thisData;
        if (index === -1) {
            thisData = { ...newData };
        } else {
            thisData = [...data];
        }
        if (index === -1) {
            thisData[type].push(newLine);
            thisData.changed = checkValidation(index);
            setnewData(thisData);
        } else {
            thisData[index][type].push(newLine);
            thisData[index].changed = checkValidation(index);
            setData(thisData);
        }
        setnewLine("");
    }
    const onClickDeleteHandler = (index, type, lineIndex) => {
        let thisData;
        if (index === -1) {
            thisData = { ...newData };
        } else {
            thisData = [...data];
        }
        if (index === -1) {
            thisData[type].splice(lineIndex, 1);
            thisData.changed = checkValidation(index);
            setnewData(thisData);
        } else {
            thisData[index][type].splice(lineIndex, 1);
            thisData[index].changed = checkValidation(index);
            setData(thisData);
        }
    }

    const onFinalSubmitButton = async (event, index) => {
        event.currentTarget.classList.add("loading");
        let response;
        if (index === -1) {
            console.log(newData);
            response = await axios.post("/api/job/", {
                company: newData.company,
                typeOfJob: newData.typeOfJob,
                duration: newData.duration,
                description: newData.description
            });
            setnewData({ ...jobSchema, description: [] });
        } else {
            console.log(data[index]);
            response = await axios.put("/api/job/", {
                id: data[index]._id,
                company: data[index].company,
                typeOfJob: data[index].typeOfJob,
                duration: data[index].duration,
                description: data[index].description
            });
        }
        setShouldUpdate(prevData => !prevData);
        console.log(response);
    }

    const onFinalDeleteHandler = async (event, index) => {
        event.currentTarget.classList.add("loading");
        console.log(data[index]);
        const response = await axios.delete("/api/job/", {
            data: {
                id: data[index]._id
            }
        });
        setShouldUpdate(prevData => !prevData);
        console.log(response);
    }

    return (
        <Tab.Pane loading={loading} style={{ minHeight: "100vmin" }}>
            <Accordion styled fluid>
                {
                    data.map((job, index) => (
                        <React.Fragment key={index}>
                            <Accordion.Title active={activeIndex === index} onClick={(event) => accordionClickHandler(event, index)}>
                                <Icon name='dropdown' />
                                {job.company}
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === index}>
                                <Form.Input
                                    fluid
                                    label="Company"
                                    style={{ margin: '1%' }}
                                    value={job.company}
                                    // onChange={(event) => { onChangeHandler(event, index, "company") }}
                                />
                                <Form.Input
                                    fluid
                                    label="Type Of Job"
                                    style={{ margin: '1%' }}
                                    value={job.typeOfJob}
                                    onChange={(event) => { onChangeHandler(event, index, "typeOfJob") }}
                                />
                                <Form.Input
                                    fluid
                                    label="Duration"
                                    style={{ margin: '1%' }}
                                    value={job.duration}
                                    onChange={(event) => { onChangeHandler(event, index, "duration") }}
                                />
                                <Form.Field>
                                    Description
                                </Form.Field>
                                {
                                    job.description.map((line, lineIndex) => (
                                        <Input
                                            icon={<Icon name="trash" color="red" link onClick={() => { onClickDeleteHandler(index, "description", lineIndex) }} />}
                                            label={lineIndex}
                                            labelPosition={"left"}
                                            style={{ margin: '1%' }}
                                            key={lineIndex}
                                            fluid
                                            value={line}
                                            onChange={(event) => { onLinesChangeHandler(event, index, lineIndex, "description") }}
                                        />
                                    ))
                                }
                                <Input
                                    icon={<Icon name="add" color="green" link disabled={newLine === ""} onClick={() => { onClickOnAddHandler(index, "description") }} />}
                                    labelPosition={"left"}
                                    placeholder="Add new line to description"
                                    style={{ margin: '1%' }}
                                    fluid
                                    value={newLine}
                                    onChange={(event) => { setnewLine(event.target.value) }}
                                />
                                <div style={{ width: "100%", textAlign: "center" }}>
                                    <Button positive disabled={job.changed ? false : true} size={"big"} onClick={(e) => { onFinalSubmitButton(e, index) }}>Update</Button>
                                    <Button negative size={"big"} onClick={(event) => { onFinalDeleteHandler(event, index) }}>Delete</Button>
                                </div>
                            </Accordion.Content>
                        </React.Fragment>
                    ))
                }
            </Accordion>
            <br/>
            <Form>
                <Form.Field>
                    <h3>Fill Job Details</h3>
                </Form.Field>

                <Form.Input
                    fluid
                    label="Company"
                    style={{ margin: '1%' }}
                    value={newData.company}
                    onChange={(event) => { onChangeHandler(event, -1, "company") }}
                />
                <Form.Input
                    fluid
                    label="Type Of Job"
                    style={{ margin: '1%' }}
                    value={newData.typeOfJob}
                    onChange={(event) => { onChangeHandler(event, -1, "typeOfJob") }}
                />
                <Form.Input
                    fluid
                    label="Duration"
                    style={{ margin: '1%' }}
                    value={newData.duration}
                    onChange={(event) => { onChangeHandler(event, -1, "duration") }}
                />
                <Form.Field>
                    Description
                </Form.Field>
                {
                    newData.description.map((line, lineIndex) => (
                        <Input
                            icon={<Icon name="trash" color="red" link onClick={() => { onClickDeleteHandler(-1, "description", lineIndex) }} />}
                            label={lineIndex}
                            labelPosition={"left"}
                            style={{ margin: '1%' }}
                            key={lineIndex}
                            fluid
                            value={line}
                            onChange={(event) => { onLinesChangeHandler(event, -1, lineIndex, "description") }}
                        />
                    ))
                }
                <Input
                    icon={<Icon name="add" color="green" link disabled={newLine === ""} onClick={() => { onClickOnAddHandler(-1, "description") }} />}
                    labelPosition={"left"}
                    placeholder="Add new line to description"
                    style={{ margin: '1%' }}
                    fluid
                    value={newLine}
                    onChange={(event) => { setnewLine(event.target.value) }}
                />
                <div style={{ width: "100%", textAlign: "center" }}>
                    <Button positive disabled={newData.changed ? false : true} size={"big"} onClick={(e) => { onFinalSubmitButton(e, -1) }}>Add New Job</Button>
                </div>
            </Form>
        </Tab.Pane>
    )
}

export default Job
